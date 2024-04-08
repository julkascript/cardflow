from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from django.test import TestCase
from order.models import Order, OrderItem
from order.serializers import OrderSerializer
from rest_framework.exceptions import PermissionDenied

User = get_user_model()

class OrderSerializerTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(username='user1', email='user1@example.com', password='password123')
        self.user2 = User.objects.create_user(username='user2', email='user2@example.com', password='password456')
        self.order = Order.objects.create(sender_user=self.user1, receiver_user=self.user2, status='ordered')
        self.order_item = OrderItem.objects.create(order=self.order, listing=None, quantity=1)

    def test_update_order_status_to_sent_as_sender(self):
        self.client.force_authenticate(user=self.user1)
        data = {'status': 'sent'}
        serializer = OrderSerializer(instance=self.order, data=data, partial=True, context={'request': None})
        self.assertTrue(serializer.is_valid())
        updated_order = serializer.save()
        self.assertEqual(updated_order.status, 'sent')
        updated_order_items = OrderItem.objects.filter(order=updated_order)
        for item in updated_order_items:
            self.assertEqual(item.status, 'sent')

    def test_update_order_status_to_received_as_receiver(self):
        self.client.force_authenticate(user=self.user2)
        data = {'status': 'received'}
        serializer = OrderSerializer(instance=self.order, data=data, partial=True, context={'request': None})
        self.assertTrue(serializer.is_valid())
        updated_order = serializer.save()
        self.assertEqual(updated_order.status, 'received')
        updated_order_items = OrderItem.objects.filter(order=updated_order)
        for item in updated_order_items:
            self.assertEqual(item.status, 'received')

    def test_update_rejected_order_status_raises_permission_error(self):
        self.client.force_authenticate(user=self.user1)
        self.order.status = 'rejected'
        self.order.save()
        data = {'status': 'sent'}
        serializer = OrderSerializer(instance=self.order, data=data, partial=True, context={'request': None})
        with self.assertRaises(PermissionDenied):
            serializer.is_valid(raise_exception=True)

    def test_update_completed_order_status_raises_permission_e
