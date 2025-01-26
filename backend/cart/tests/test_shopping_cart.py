from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from cart.models import ShoppingCartItem, ShoppingCart
from cart.serializers import AddShoppingCartItemSerializer, ShoppingCartItemSerializer
from game.models import Game
from listing.models import Listing
from yugioh.models import YugiohCardInSet, YugiohCardRarity, YugiohCardSet, YugiohCard

User = get_user_model()


def create_user(**params):
    return get_user_model().objects.create_user(**params)


def create_listing(**params):
    defaults = {
        'price': 10.00,
        'condition': "poor",
        'quantity': 10,
        'is_listed': True,
        'is_sold': False,
    }

    defaults.update(params)
    return Listing.objects.create(**defaults)


class ShoppingCartItemViewSetTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.user1 = create_user(
            username='testuser',
            email='test@x.com',
            password='12345',
        )
        self.user2 = self.user = create_user(
            username='testuser2',
            email='test2@x.com',
            password='12345',
        )

        self.user2_cart, self.created = ShoppingCart.objects.get_or_create(user=self.user2)

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
            )
        )
        self.client.force_authenticate(self.user2)

        self.listing = create_listing(
            user=self.user1,
            card=self.yugioh_card_in_set)

        self.listing2 = create_listing(
            user=self.user1,
            card=self.yugioh_card_in_set)

        self.cart_item = ShoppingCartItem.objects.create(cart=self.user2_cart, listing=self.listing, quantity=2)

    def test_add_cart_item(self):
        self.client.force_authenticate(self.user2)
        data = {'listing_id': self.listing2.id, 'quantity': 4}
        self.client.post('/api/cart/items/', data=data)
        serializer = AddShoppingCartItemSerializer(data=data, context={'cart': self.user2_cart})
        self.assertTrue(serializer.is_valid())
        serializer.save()
        self.assertEqual(ShoppingCartItem.objects.count(), 2)
        self.assertEqual(ShoppingCartItem.objects.get(id=2).quantity, 4)

    def test_get_cart_items(self):
        self.client.force_authenticate(self.user2)
        response = self.client.get('/api/cart/items/')
        data = response.json()

        actual_cart_items = ShoppingCartItem.objects.filter(cart__user=self.user2)

        serializer = ShoppingCartItemSerializer(actual_cart_items, many=True,
                                                context={'request': response.wsgi_request})
        expected_data = {
            'count': actual_cart_items.count(),
            'next': None,
            'previous': None,
            'results': serializer.data,
        }

        self.assertEqual(data, expected_data)
        self.assertEqual(response.status_code, 200)

    def test_checkout(self):
        self.client.force_authenticate(self.user2)

        listing_quantity_before = self.listing.quantity

        cart_items_before = ShoppingCartItem.objects.filter(cart=self.user2_cart)
        self.assertEqual(cart_items_before.count(), 1)

        response = self.client.post('/api/cart/items/checkout/', {'delivery_address': '123 Test St', 'phone_number': '123456789', 'names': 'John Doe'})

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['message'], 'Checkout successful')
        self.assertTrue('orders' in response.data)

        cart_items_after = ShoppingCartItem.objects.filter(cart=self.user2_cart)
        self.assertEqual(cart_items_after.count(), 0)

        self.listing.refresh_from_db()

        listing_quantity_after = self.listing.quantity

        self.assertEqual(listing_quantity_after, listing_quantity_before - self.cart_item.quantity)

    def test_listing_marked_as_sold_after_checkout(self):
        self.client.force_authenticate(self.user2)

        self.cart_item.quantity = self.listing.quantity
        self.cart_item.save()

        response = self.client.post('/api/cart/items/checkout/', {'delivery_address': '123 Test St', 'phone_number': '123456789', 'names': 'John Doe'})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['message'], 'Checkout successful')
        self.assertTrue('orders' in response.data)

        self.listing.refresh_from_db()

        self.assertTrue(self.listing.is_sold)
        self.assertFalse(self.listing.is_listed)
