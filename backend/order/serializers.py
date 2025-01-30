from datetime import datetime, timedelta

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
    order_items = OrderItemSerializer(many=True, read_only=True, source='orderitem_set')
    status_history = OrderStatusHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['order_id', 'sender_user', 'receiver_user', 'status', 'delivery_address', 'order_items',
                  'status_history', 'phone_number', 'names']

    def get_order_id(self, obj):
        return obj.id

    def update(self, instance, validated_data):

        user = self.context['request'].user
        sender_user = instance.sender_user
        receiver_user = instance.receiver_user

        if 'status' in validated_data and len(validated_data) == 1:

            if self.order_cannot_be_updated_further(instance.status):
                raise serializers.ValidationError("This order's status cannot be updated further")

            if user != sender_user and user != receiver_user:
                raise exceptions.PermissionDenied("You don't have permission to update this order")

            if self.get_status_index(validated_data['status']) < self.get_status_index(instance.status):
                raise serializers.ValidationError("Cannot downgrade the status of an order")

            if validated_data['status'] == 'sent':
                if user != sender_user:
                    raise exceptions.PermissionDenied("You don't have permissions to perform this action")

            if instance.status != 'sent' and validated_data['status'] == 'completed':
                raise exceptions.ValidationError('Only sent orders can be marked as completed')

            if validated_data['status'] == 'rejected':

                for order_item in instance.orderitem_set.all():
                    order_listing = order_item.listing
                    order_listing.quantity += order_item.quantity
                    order_item.is_listed = True
                    order_listing.is_sold = False
                    order_listing.save()

            if validated_data['status'] == 'not_received':
                # Check if 10 days have passed since the order was placed
                if instance.status_history.exists():
                    order_placed_date = instance.status_history.last().timestamp.date()
                    print(order_placed_date)
                    if datetime.now().date() < order_placed_date + timedelta(days=10):
                        raise serializers.ValidationError(
                            "Order can be marked as 'Not Received' only after 10 days from the order placement date.")

                for order_item in instance.orderitem_set.all():
                    order_listing = order_item.listing
                    order_listing.quantity += order_item.quantity
                    order_item.is_listed = True
                    order_listing.is_sold = False
                    order_listing.save()

            return super().update(instance, validated_data)

        raise exceptions.PermissionDenied("You can update only the status from this endpoint")

    def get_status_index(self, status):

        status_order = ['ordered', 'sent', 'completed', 'rejected', 'not_sent', 'not_received']

        return status_order.index(status)

    def order_cannot_be_updated_further(self, status):
        final_statuses = ['completed', 'rejected', 'not_sent', 'not_received']

        return status in final_statuses


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
