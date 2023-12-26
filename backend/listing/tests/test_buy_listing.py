from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from game.models import Game
from listing.models import Listing
from yugioh.models import YugiohCardInSet, YugiohCardRarity, YugiohCardSet, YugiohCard


def create_user(**params):
    return get_user_model().objects.create_user(**params)


def create_listing(**params):
    defaults = {
        'price': 10.00,
        'condition': "poor",
        'quantity': 1,
        'is_listed': True,
        'is_sold': False,
    }

    defaults.update(params)
    return Listing.objects.create(**defaults)


class BuyListingViewSetTests(TestCase):

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
            password='123451',
        )

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

        self.listing = create_listing(user=self.user1, card=self.yugioh_card_in_set)

        self.LISTING_BUY_URL = reverse('listing:listing_buy', args=[self.listing.id])

    def test_mark_as_sold(self):
        payload = {
            'is_sold': True,
        }

        response = self.client.put(self.LISTING_BUY_URL, payload)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.listing.refresh_from_db()
        self.assertTrue(self.listing.is_sold)
        self.assertFalse(self.listing.is_listed)

    def test_mark_as_sold_already_sold(self):
        self.listing.is_sold = True
        self.listing.save()

        response = self.client.put(self.LISTING_BUY_URL)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_mark_as_sold_unlisted_item(self):
        # Ensure trying to mark an unlisted item results in a 400 Bad Request
        self.listing.is_listed = False
        self.listing.save()

        response = self.client.put(self.LISTING_BUY_URL)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_mark_as_sold_own_listing(self):
        # Ensure trying to buy your own listing results in a 403 Forbidden
        self.listing.user = self.user2
        self.listing.save()

        response = self.client.put(self.LISTING_BUY_URL)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unsold_listings(self):
        url_unsold_listings = reverse('listing:unsold_listings')
        response = self.client.get(url_unsold_listings)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(len(response.data), 1)

    def test_sold_listings(self):
        self.listing.is_sold = True
        self.listing.save()

        url = reverse('listing:sold_listings')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
