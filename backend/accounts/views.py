from django.contrib.auth import get_user_model
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, generics, serializers, status, permissions, views
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.core.mail import send_mail

from cardflow import settings

from accounts.serializers import RegistrationSerializer, MyTokenObtainPairSerializer, UpdateUserSerializer, ContactFormSerializer

from accounts.filters import UserFilter

from accounts.permissions import IsOwnerOfObject

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
            return Response({'username': serializer.data[0]['username'], 'avatar': serializer.data[0]['avatar']})
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