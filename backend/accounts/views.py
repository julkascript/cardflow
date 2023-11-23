from django.contrib.auth import get_user_model
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from accounts.serializers import RegistrationSerializer, MyTokenObtainPairSerializer

User = get_user_model()


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


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
