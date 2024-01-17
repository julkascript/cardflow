from rest_framework import serializers

from accounts.serializers import UserSerializer
from listing.models import Listing
from listing.serializers import ListingSerializer
from order.models import Order


class OrderSerializer(serializers.ModelSerializer):
    sender_user = serializers.SerializerMethodField(read_only=True)
    receiver_user = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = '__all__'

    def get_sender_user(self, obj):
        return UserSerializer(obj.listing.user).data

    def get_receiver_user(self, obj):
        user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user
        return UserSerializer(user).data

    def create(self, validated_data):
        listing = validated_data.pop('listing')

        order = Order.objects.create(**validated_data, listing_id=listing.pk, sender_user=listing.user)

        return order
