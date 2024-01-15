from rest_framework import serializers

from accounts.serializers import UserSerializer
from listing.serializers import ListingSerializer
from orders.models import Order


class OrderSerializer(serializers.ModelSerializer):
    listing = ListingSerializer(read_only=True)
    sender_user = UserSerializer(read_only=True)
    

    class Meta:
        model = Order
        fields = '__all__'

    def create(self, validated_data):
        listing_user = validated_data['listing'].user

        validated_data['sender_user'] = listing_user

        return super().create(validated_data)