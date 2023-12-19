from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APIClient

from listing.models import Listing
from yugioh.models import YugiohCard, YugiohCardInSet, YugiohCardRarity, YugiohCardSet

from game.models import Game

from listing.serializers import ListingSerializer

LISTING_URL = reverse('listing:listings')


def create_user(**params):
    return get_user_model().objects.create_user(**params)


def detail_url(listing_id):
    return reverse('listing:listing_detail', args=[listing_id])


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


class PublicListingApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = create_user(
            username='testuser',
            email='test@x.com',
            password='12345',
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

    def test_access_listing_url_success(self):
        res = self.client.get(LISTING_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_get_all_listings(self):
        create_listing(user=self.user, card=self.yugioh_card_in_set)
        create_listing(user=self.user, card=self.yugioh_card_in_set)

        res = self.client.get(LISTING_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data['results']), 2)


class PrivateListingApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = create_user(
            username='testuser',
            email='test@x.com',
            password='12345',
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
        self.client.force_authenticate(self.user)

    def test_access_listing_url_success(self):
        res = self.client.get(LISTING_URL)

        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_get_all_listings(self):
        create_listing(user=self.user, card=self.yugioh_card_in_set)
        create_listing(user=self.user, card=self.yugioh_card_in_set)

        res = self.client.get(LISTING_URL)

        listings = Listing.objects.all().order_by('-id')
        serializer = ListingSerializer(listings, many=True)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data['results']), len(serializer.data))

    def get_listing_detail(self):
        listing = create_listing(user=self.user, card=self.yugioh_card_in_set)

        url = detail_url(listing.id)
        res = self.client.get(url)

        serializer = ListingSerializer(listing)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data, serializer.data)

    def test_create_listing_from_authorized_user(self):
        payload = {
            'user': self.user.id,
            'card': self.yugioh_card_in_set.id,
            'price': 10.00,
            'condition': "poor",
            'quantity': 1,
            'is_listed': True,
            'is_sold': False,
        }

        res = self.client.post(LISTING_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['user'], self.user.id)
        self.assertEqual(res.data['card'], self.yugioh_card_in_set.id)

    def create_listing_from_unauthorized_user_error(self):
        self.client.force_authenticate(user=None)

        payload = {
            'user': self.user.id,
            'card': self.yugioh_card_in_set.id,
            'price': 10.00,
            'condition': "poor",
            'quantity': 1,
            'is_listed': True,
            'is_sold': False,
        }

        res = self.client.post(LISTING_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_listing(self):
        listing = create_listing(user=self.user, card=self.yugioh_card_in_set)
        payload = {
            'user': self.user.id,
            'card': self.yugioh_card_in_set.id,
            'price': 5.00,
            'condition': "good",
            'quantity': 1,
            'is_listed': True,
            'is_sold': False,
        }

        url = detail_url(listing.id)
        res = self.client.put(url, payload)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['user'], self.user.id)
        self.assertEqual(res.data['card'], self.yugioh_card_in_set.id)
        self.assertEqual(res.data['price'], 5.00)
        self.assertEqual(res.data['condition'], "good")

    def test_delete_listing(self):
        listing = create_listing(user=self.user, card=self.yugioh_card_in_set)

        url = detail_url(listing.id)
        res = self.client.delete(url)

        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)

    def test_listing_another_user_update_error(self):

        other_user = create_user(
            username='otheruser',
            email='other@x.com',
            password='12345',
        )

        listing = create_listing(user=other_user, card=self.yugioh_card_in_set)

        payload = {
            'user': self.user.id,
            'card': self.yugioh_card_in_set.id,
            'price': 5.00,
            'condition': "good",
            'quantity': 1,
            'is_listed': True,
            'is_sold': False,
        }

        url = detail_url(listing.id)
        res = self.client.put(url, payload)

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_listing_another_user_delete_error(self):

        other_user = create_user(
            username='otheruser',
            email='other@x.com',
            password='12345',
        )

        listing = create_listing(user=other_user, card=self.yugioh_card_in_set)

        url = detail_url(listing.id)
        res = self.client.delete(url)

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthorized_listing_update_error(self):
        listing = create_listing(user=self.user, card=self.yugioh_card_in_set)

        self.client.force_authenticate(user=None)

        payload = {
            'user': self.user.id,
            'card': self.yugioh_card_in_set.id,
            'price': 5.00,
            'condition': "good",
            'quantity': 1,
            'is_listed': True,
            'is_sold': False,
        }

        url = detail_url(listing.id)
        res = self.client.put(url, payload)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthorized_listing_delete_error(self):
        listing = create_listing(user=self.user, card=self.yugioh_card_in_set)

        self.client.force_authenticate(user=None)

        url = detail_url(listing.id)
        res = self.client.delete(url)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
