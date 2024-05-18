from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

from order.models import FeedbackAndRating, Order
from order.serializers import FeedbackAndRatingSerializer

User = get_user_model()


class FeedbackAndRatingTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(username='user1', email='vDnC9@example.com', password='password123')
        self.user2 = User.objects.create_user(username='user2', email='JQXp0@example.com', password='password456')
        self.order = Order.objects.create(sender_user=self.user1, receiver_user=self.user2)
        self.feedback = FeedbackAndRating.objects.create(receiver_user=self.user1, sender_user=self.user2,
                                                         related_order=self.order, rating=4, comment='Great service')

    def test_list_feedbacks_and_ratings(self):
        response = self.client.get('/api/feedback/')
        self.assertEqual(response.status_code, 200)

    def test_retrieve_feedbacks_and_ratings_for_user(self):
        response = self.client.get(f'/api/feedback/user/{self.user1.id}/')
        self.assertEqual(response.status_code, 200)

    def test_retrieve_feedbacks_and_ratings_for_nonexistent_user(self):
        response = self.client.get('/api/feedback/user/999/')
        self.assertEqual(response.status_code, 404)
