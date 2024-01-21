from django.contrib.auth import get_user_model
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, generics, serializers, status, permissions
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from accounts.serializers import RegistrationSerializer, MyTokenObtainPairSerializer, UpdateUserSerializer

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
        - API endpoint: /api/accounts/user/<int:pk>/
    """

    queryset = User.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOfObject]
    serializer_class = UpdateUserSerializer
    parser_classes = [JSONParser, MultiPartParser, FormParser]
    filter_backends = [DjangoFilterBackend]
    filterset_class = UserFilter
    http_method_names = ['get', 'put', 'patch', 'delete']

    def list(self, request, *args, **kwargs):

        queryset = self.filter_queryset(self.get_queryset())
        user_name = self.request.query_params.get('username', None)

        if user_name is None:
            raise ValidationError('Username is required')

        queryset = queryset.filter(username=user_name)

        serializer = self.get_serializer(queryset, many=True)

        return Response({'username': serializer.data[0]['username'], 'avatar': serializer.data[0]['avatar']})

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
