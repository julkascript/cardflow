from django.contrib.auth import get_user_model
from rest_framework import serializers

from listing.models import Listing
from listing.serializers import ListingSerializer
from order.models import Order

User = get_user_model()


class OrderSerializer(serializers.ModelSerializer):
    sender_user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    receiver_user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    listing = ListingSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'sender_user', 'receiver_user', 'status', 'delivery_address', 'listing']

    def create(self, validated_data):
        # Extract listings from validated_data
        listing_data = validated_data.pop('listing', [])

        order = Order.objects.create(**validated_data)

        # Add listings to the order
        for listing in listing_data:
            order.listing.add(listing)

        return order
