from django.contrib.auth import get_user_model
from rest_framework import serializers

from listing.serializers import ListingSerializer
from order.models import Order, OrderItem

User = get_user_model()


class OrderItemSerializer(serializers.ModelSerializer):
    listing = ListingSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['listing', 'quantity']


class OrderSerializer(serializers.ModelSerializer):
    sender_user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    receiver_user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    order_items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'sender_user', 'receiver_user', 'status', 'delivery_address', 'order_items']

