from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.authentication import JWTAuthentication

User = get_user_model()


class RegistrationViewTests(TestCase):

    def setUp(self):
        self.client = APIClient()

    def test_registration_view_returns_tokens(self):
        url = reverse('accounts:register-list')
        data = {'username': 'test', 'password': '123451'}
        response = self.client.post(url, data, format='json')

        user = User.objects.get(username='test')

        JWT_authenticator = JWTAuthentication()

        decoded_access_token = JWT_authenticator.get_validated_token(response.data['access'])
        decoded_user = JWT_authenticator.get_user(decoded_access_token)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

        self.assertTrue(User.objects.filter(username='test').exists())
        self.assertEqual(decoded_user, user)
