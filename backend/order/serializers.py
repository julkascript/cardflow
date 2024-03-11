from django.contrib.auth import get_user_model
from rest_framework import serializers, exceptions

from accounts.serializers import UserSerializer
from listing.serializers import ListingSerializer
from order.models import Order, OrderItem, FeedbackAndRating, OrderStatusHistory

User = get_user_model()


class OrderStatusHistorySerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S')

    class Meta:
        model = OrderStatusHistory
        fields = ['status', 'timestamp']


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
    status_history = OrderStatusHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['order_id', 'sender_user', 'receiver_user', 'status', 'delivery_address', 'order_items',
                  'status_history']

    def get_order_id(self, obj):
        return obj.id

    def update(self, instance, validated_data):

        user = self.context['request'].user
        sender_user = instance.sender_user
        receiver_user = instance.receiver_user

        if instance.status == 'rejected' or instance.status == 'completed':
            raise serializers.ValidationError("Rejected or Completed order cannot be updated.")

        if 'status' in validated_data and validated_data['status'] == 'sent':
            if user != sender_user:
                raise exceptions.PermissionDenied("Only the sender is allowed to mark the order as 'sent'")

        if 'status' in validated_data and validated_data['status'] == 'rejected':

            if user != sender_user and user != receiver_user:
                raise exceptions.PermissionDenied("You don't have permission to update this order status.")

            for order_item in instance.orderitem_set.all():
                order_listing = order_item.listing
                order_listing.quantity += order_item.quantity
                order_item.is_listed = True
                order_listing.is_sold = False
                order_listing.save()

        return super().update(instance, validated_data)


class FeedbackAndRatingSerializer(serializers.ModelSerializer):
    receiver_user = FeedbackAndRating.receiver_user
    sender_user = FeedbackAndRating.sender_user
    related_order = FeedbackAndRating.related_order

    class Meta:
        model = FeedbackAndRating
        fields = ['receiver_user', 'sender_user', 'related_order', 'rating', 'comment']
        read_only_fields = ['sender_user', 'receiver_user']

    def validate(self, attrs):
        related_order = attrs['related_order']

        if not related_order:
            raise serializers.ValidationError('Order does not exist')

        sender_user = related_order.receiver_user
        receiver_user = related_order.sender_user

        if receiver_user == self.context['request'].user:
            raise serializers.ValidationError('User cannot give feedback to himself')

        if self.context['request'].user != sender_user:
            raise serializers.ValidationError('You are not allowed to give feedback for this order')

        if receiver_user != related_order.sender_user:
            raise serializers.ValidationError('The user you are trying to give feedback is not the seller of the order')

        if attrs['related_order'].id in [order['related_order'] for order in
                                         FeedbackAndRating.objects.values('related_order')]:
            raise serializers.ValidationError('User already gave feedback for this order')

        return attrs
