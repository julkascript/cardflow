from django.contrib.auth import get_user_model
from rest_framework import serializers, exceptions

from accounts.serializers import UserSerializer
from listing.serializers import ListingSerializer
from order.models import Order, OrderItem

User = get_user_model()


class OrderItemSerializer(serializers.ModelSerializer):
    listing = ListingSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['listing', 'quantity']


class OrderSerializer(serializers.ModelSerializer):
    order_id = serializers.SerializerMethodField()
    sender_user = UserSerializer()
    receiver_user = UserSerializer()
    order_items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['order_id', 'sender_user', 'receiver_user', 'status', 'delivery_address', 'order_items']

    def get_order_id(self, obj):
        return obj.id

    def update(self, instance, validated_data):

        user = self.context['request'].user
        sender_user = instance.sender_user
        receiver_user = instance.receiver_user

        if 'status' in validated_data and validated_data['status'] == 'rejected':

            if user != sender_user or user != receiver_user:
                raise exceptions.PermissionDenied("You don't have permission to update this order status.")

            for order_item in instance.orderitem_set.all():
                order_listing = order_item.listing
                order_listing.quantity += order_item.quantity
                order_item.is_listed = True
                order_listing.is_sold = False
                order_listing.save()

        return super().update(instance, validated_data)
