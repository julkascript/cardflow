from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.exceptions import PermissionDenied
from rest_framework.test import APIClient, APIRequestFactory

from cart.tests.test_shopping_cart import create_listing
from game.models import Game
from order.models import Order, OrderItem, OrderStatusHistory
from order.serializers import OrderSerializer
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
        self.order_item = OrderItem.objects.create(order=self.order, listing=self.listing, quantity=1)
        self.factory = APIRequestFactory()

    def test_update_order_status(self):
        request = self.factory.patch('/api/order/{0}/'.format(self.order.pk))
        request.user = self.user1
        serializer = OrderSerializer(instance=self.order, data={'status': 'sent'}, context={'request': request},
                                     partial=True)
        self.assertTrue(serializer.is_valid())
        serializer.save()
        self.order.refresh_from_db()
        self.assertEqual(self.order.status, 'sent')

    def test_restricted_order_status_update(self):
        request = self.factory.patch('/api/order/{0}/'.format(self.order.pk))
        request.user = self.user2  # A user who shouldn't be allowed to update
        serializer = OrderSerializer(instance=self.order, data={'status': 'sent'}, context={'request': request},
                                     partial=True)
        with self.assertRaises(PermissionDenied):
            serializer.is_valid(raise_exception=True)

    def test_update_order_status_history(self):
        request = self.factory.patch('/api/order/{0}/'.format(self.order.pk))
        request.user = self.user1
        serializer = OrderSerializer(instance=self.order, data={'status': 'sent'}, context={'request': request},
                                     partial=True)
        self.assertTrue(serializer.is_valid())
        serializer.save()

        # Check if a new status history entry is created
        self.assertEqual(OrderStatusHistory.objects.count(), 1)
