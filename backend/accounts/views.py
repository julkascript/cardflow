from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.utils.timezone import now
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, status, views
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from accounts.filters import UserFilter
from accounts.permissions import IsOwnerOfObject
from accounts.serializers import RegistrationSerializer, MyTokenObtainPairSerializer, UpdateUserSerializer, \
    ContactFormSerializer, UserSerializer
from cardflow import settings
from order.models import OrderStatusHistory

User = get_user_model()


@extend_schema(tags=['Accounts'])
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@extend_schema(tags=['Accounts'])
class RegistrationView(viewsets.ModelViewSet):
    serializer_class = RegistrationSerializer
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = MyTokenObtainPairSerializer.get_token(user)
        access_token = refresh.access_token

        return Response({
            'refresh': str(refresh),
            'access': str(access_token),
        })


@extend_schema(tags=['Accounts'])
class UserUpdateView(viewsets.ModelViewSet):
    """
    View for get or update the user personal information and user delete \n
        - API endpoint: /api/accounts/user/
    """

    queryset = User.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOfObject]
    serializer_class = UpdateUserSerializer
    parser_classes = [JSONParser, FormParser, MultiPartParser]
    filter_backends = [DjangoFilterBackend]
    filterset_class = UserFilter

    def list(self, request, *args, **kwargs):

        queryset = self.filter_queryset(self.get_queryset())
        user_name = self.request.query_params.get('username', None)

        if user_name is None:
            data = self.get_serializer(queryset, many=True).data

            result = []

            for user in data:
                result.append({'username': user['username'], 'avatar': user['avatar']})

            return Response(result)

        queryset = queryset.filter(username=user_name)

        serializer = self.get_serializer(queryset, many=True)

        try:
            user_data = serializer.data[0]
            user = queryset[0]

            # Calculate Purchases
            purchases_count = UserSerializer.get_purchases_count(user.id)

            # Calculate Sales
            sales_count = UserSerializer.get_sales_count(user.id)

            # Calculate Sales This Month
            current_month = now().month
            current_year = now().year
            sales_this_month_count = OrderStatusHistory.objects.filter(
                order__sender_user=user,
                status='ordered',
                timestamp__year=current_year,
                timestamp__month=current_month
            ).count()

            # Calculate Seller Rating
            avg_rating = UserSerializer.get_average_rating(user.id)

            # Calculate Rejection Rate

            final_rejected_ordered_sales_count = UserSerializer.get_rejection_rate(user)

            # Calculate Missed Rate
            missed_sent_sales_count = UserSerializer.get_miss_rate(user)

            if sales_count > 0:
                rejection_rate = (final_rejected_ordered_sales_count / sales_count) * 100
                miss_rate = (missed_sent_sales_count / sales_count) * 100
            else:
                rejection_rate = 0
                miss_rate = 0

            stats_data = {
                'purchases': purchases_count,
                'sales': sales_count,
                'sales_this_month': sales_this_month_count,
                'seller_rating': f"{avg_rating}",
                'rejection_rate': round(rejection_rate),
                'miss_rate': round(miss_rate)
            }

            return Response({
                'username': user_data['username'],
                'avatar': user_data['avatar'],
                'stats': stats_data
            })
        except IndexError:
            return Response('User not found', status=status.HTTP_404_NOT_FOUND)


def retrieve(self, request, *args, **kwargs):
    instance = self.get_object()
    serializer = self.get_serializer(instance)
    return Response(serializer.data)


@extend_schema(tags=["Contact Form"])
class ContactFormView(views.APIView):
    """
    View for handling contact form submissions and sending emails \n
        - API endpoint: /api/contacts/
    """
    serializer_class = ContactFormSerializer

    def post(self, request, *args, **kwargs):
        serializer_class = ContactFormSerializer(data=request.data)
        email = request.data.get("email")
        message = request.data.get("message")

        if not serializer_class.is_valid():
            if not message:
                return Response({"error": "Message is required"}, status=status.HTTP_400_BAD_REQUEST)

            if not email:
                return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

            return Response({"error": "Please enter a valid email"}, status=status.HTTP_400_BAD_REQUEST)

        send_mail(
            subject="Contact Form Submission",
            message=f"Email: {email}\nMessage: {message}",
            from_email=settings.CONTACT_FORM_EMAIL,
            recipient_list=[settings.CONTACT_FORM_EMAIL_RECIPIENT],
            fail_silently=False,
        )

        return Response({"success": "Email sent successfully"}, status=status.HTTP_200_OK)
