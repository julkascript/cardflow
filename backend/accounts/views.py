from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.serializers import UserSerializer

User = get_user_model()


class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
