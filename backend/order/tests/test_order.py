from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from cart.tests.test_shopping_cart import create_listing
from game.models import Game
from order.models import Order, OrderItem, OrderStatusHistory
from yugioh.models import YugiohCardInSet, YugiohCardRarity, YugiohCardSet, YugiohCard

User = get_user_model()


class OrderSerializerTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(username='user1', email='user1@example.com', password='password123')
        self.user2 = User.objects.create_user(username='user2', email='user2@example.com', password='password456')

        self.yugioh_card_in_set = YugiohCardInSet.objects.create(
            rarity=YugiohCardRarity.objects.create(rarity='Common', rarity_code='C'),
            set=YugiohCardSet.objects.create(card_set_name='Test Set', set_code='TST'),
            yugioh_card=YugiohCard.objects.create(
                card_name='Test Card',
                game=Game.objects.create(game_name='Test Game'),
                type='Spell',
                description='Test Description',
                attack=10,
                defense=10,
                level=1,
                race='Test Race',
                attribute='Test Attribute',
                archetype='Test Archetype',
                image='https://example.com/image.jpg',
            ))

        self.order = Order.objects.create(sender_user=self.user1, receiver_user=self.user2, status='ordered')
        self.listing = create_listing(user=self.user1, card=self.yugioh_card_in_set)
        self.order_item = OrderItem.objects.create(order=self.order, listing=self.listing, quantity=2)

    def test_update_order_status(self):
        self.client.force_authenticate(user=self.user1)
        # Make a PATCH request to update order status
        response = self.client.patch(f'/api/order/{self.order.pk}/', {'status': 'sent'}, format='json')

        self.assertEqual(response.status_code, 200)

        # Refresh the order from the database and assert the status
        self.order.refresh_from_db()
        self.assertEqual(self.order.status, 'sent')
        self.client.force_authenticate(user=None)

    def test_restricted_order_status_update(self):
        self.client.force_authenticate(user=self.user2)

        # Make a PATCH request to update order status
        response = self.client.patch(f'/api/order/{self.order.pk}/', {'status': 'sent'}, format='json')

        self.assertEqual(response.status_code, 403)
        self.client.force_authenticate(user=None)

    def test_update_order_status_history(self):

        self.client.force_authenticate(user=self.user1)
        self.order.status = 'sent'
        self.order.save()
        self.order.refresh_from_db()

        response = self.client.patch(f'/api/order/{self.order.pk}/', {'status': 'completed'}, format='json')
        self.assertEqual(response.status_code, 200)
        self.order.refresh_from_db()
        self.assertEqual(self.order.status, 'completed')

        # Check if a new status history entry is created
        new_order_history = OrderStatusHistory.objects.filter(order=self.order).order_by('-timestamp').first()
        self.assertEqual(new_order_history.status, 'completed')

