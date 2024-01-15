from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from rest_framework.authtoken.models import Token

User = get_user_model()


# ACCOUNTS_URL = reverse('accounts:account_update')


class UserUpdateViewTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpassword',
            email='testuser@example.com'
        )
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')
        self.client.force_authenticate(user=self.user)

    def test_auth_required(self):
        self.client.force_authenticate(user=None)
        url = reverse('accounts:account_update', args=[self.user.pk])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_user_information(self):
        url = reverse('accounts:account_update', args=[self.user.pk])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_user_information_unauthorized(self):
        other_user = User.objects.create_user(
            username='otheruser',
            password='otherpassword',
            email='otheruser@example.com'
        )

        url = reverse('accounts:account_update', args=[other_user.pk])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(other_user.username, 'otheruser')

    def test_delete_user(self):
        url = reverse('accounts:account_update', args=[self.user.pk])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(User.objects.filter(pk=self.user.pk).exists())

    def test_delete_user_unauthorized_returns_forbidden(self):
        other_user = User.objects.create_user(
            username='otheruser',
            password='otherpassword',
            email='otheruser@example.com'
        )
        url = reverse('accounts:account_update', args=[other_user.pk])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(User.objects.filter(pk=other_user.pk).exists())

    def test_delete_user_unauthorized_returns_unauthorized(self):
        self.client.force_authenticate(user=None)
        url = reverse('accounts:account_update', args=[self.user.pk])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertTrue(User.objects.filter(pk=self.user.pk).exists())

    def test_update_user(self):
        url = reverse('accounts:account_update', args=[self.user.pk])
        data = {
            'username': 'newusername',
            'email': 'newtestuser@example.com',
        }
        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.username, 'newusername')
        self.assertEqual(self.user.email, 'newtestuser@example.com')

    def test_update_user_unauthorized_returns_forbidden(self):
        other_user = User.objects.create_user(
            username='otheruser',
            password='otherpassword',
            email='otheruser@example.com'
        )
        url = reverse('accounts:account_update', args=[other_user.pk])
        data = {
            'username': 'newusername',
            'email': 'newtestuser@example.com',
        }
        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.user.refresh_from_db()
        self.assertNotEqual(self.user.username, 'newusername')
        self.assertNotEqual(self.user.email, 'newtestuser@example.com')

    def test_update_user_unauthorized_returns_unauthorized(self):
        self.client.force_authenticate(user=None)
        url = reverse('accounts:account_update', args=[self.user.pk])
        data = {
            'username': 'newusername',
            'email': 'newtestuser@example.com',
        }
        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.user.refresh_from_db()
        self.assertNotEqual(self.user.username, 'newusername')
        self.assertNotEqual(self.user.email, 'newtestuser@example.com')

    def test_update_user_password(self):
        url = reverse('accounts:account_update', args=[self.user.pk])
        data = {
            'password': 'newpassword',
        }
        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('newpassword'))

    def test_update_user_password_unauthorized_returns_forbidden(self):
        other_user = User.objects.create_user(
            username='otheruser',
            password='otherpassword',
            email='otheruser@example.com'
        )
        url = reverse('accounts:account_update', args=[other_user.pk])
        data = {
            'password': 'newpassword',
        }
        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.user.refresh_from_db()
        self.assertNotEqual(self.user.check_password('newpassword'), True)

    def test_update_user_password_unauthorized_returns_unauthorized(self):
        self.client.force_authenticate(user=None)
        url = reverse('accounts:account_update', args=[self.user.pk])
        data = {
            'password': 'newpassword',
        }
        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.user.refresh_from_db()
        self.assertNotEqual(self.user.check_password('newpassword'), True)

    def test_update_user_email(self):
        url = reverse('accounts:account_update', args=[self.user.pk])
        data = {
            'email': 'newtestuser@example.com',
        }
        response = self.client.patch(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.email, 'newtestuser@example.com')
