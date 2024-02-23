from django.contrib.auth import get_user_model
from rest_framework import serializers, status
from rest_framework.exceptions import PermissionDenied
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}


class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'email')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class UpdateUserSerializer(serializers.ModelSerializer):
    """
    Used for updating the user.
    """
    avatar = serializers.ImageField(allow_null=True, required=False)

    class Meta:
        model = User
        fields = (
            'id', 'username', 'password', 'email', 'first_name', 'last_name',
            'phone_number', 'city', 'shipping_address', 'avatar'
        )
        read_only_fields = ('id',)
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
            'username': {'required': False},
        }

    def validate_email(self, value):
        user = self.context['request'].user

        if User.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError({'email': 'This email is already in use.'})
        return value

    def validate_username(self, value):
        user = self.context['request'].user

        if User.objects.exclude(pk=user.pk).filter(username=value).exists():
            raise PermissionDenied({'username': 'This username is already in use.'})
        return value

    def update(self, instance, validated_data):
        user = self.context['request'].user

        if user.pk != instance.pk:
            raise PermissionDenied({'authorize': 'You dont have permission for this user.'})

        for attr, value in validated_data.items():
            if attr == 'password':
                instance.set_password(value)
            elif attr == 'avatar':
                if value:
                    instance.avatar = value
            else:
                setattr(instance, attr, value)

        instance.save()

        return instance


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username
        token['email'] = user.email

        return token


class ContactFormSerializer(serializers.Serializer):
    email = serializers.EmailField()
    message = serializers.CharField()
