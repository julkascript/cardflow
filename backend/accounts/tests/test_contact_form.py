from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from unittest.mock import patch


class ContactFormViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_api_endpoint_access(self):
        url = reverse("contact_form")
        response = self.client.post(url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_valid_contact_form_submission(self):
        url = reverse("contact_form")
        data = {"email": "test@example.com", "message": "Test message"}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_missing_email(self):
        url = reverse("contact_form")
        data = {"message": "Test message"}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {"error": "Email is required"})

    def test_missing_message(self):
        url = reverse("contact_form")
        data = {"email": "test@example.com"}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {"error": "Message is required"})

    def test_invalid_contact_form_data(self):
        url = reverse("contact_form")
        data = {"email": "invalid_email", "message": "Test message"}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
