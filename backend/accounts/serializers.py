from django.contrib.auth import get_user_model
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'password', 'email']
        extra_kwargs = {'password': {'write_only': True}}


class TokenObtainPairSerializer(serializers.Serializer):
    username_field = get_user_model().USERNAME_FIELD

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields[self.username_field] = serializers.CharField()
        self.fields['password'] = serializers.CharField(write_only=True)
        self.fields['email'] = serializers.EmailField(required=False)


class TokenObtainPairResponseSerializer(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()
