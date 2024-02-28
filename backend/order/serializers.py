from django.contrib.auth import get_user_model
from rest_framework import serializers

from accounts.serializers import UserSerializer
from listing.serializers import ListingSerializer
from order.models import Order, OrderItem, FeedbackAndRating

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


class FeedbackAndRatingSerializer(serializers.ModelSerializer):
    given_to = FeedbackAndRating.given_to
    given_from = FeedbackAndRating.given_from
    related_order = FeedbackAndRating.related_order

    class Meta:
        model = FeedbackAndRating
        fields = ['given_to', 'given_from', 'related_order', 'rating', 'comment']
        read_only_fields = ['given_from']

    def validate(self, attrs):
        given_from = self.context['request'].user

        if given_from == attrs['given_to']:
            raise serializers.ValidationError('User cannot give feedback to himself')

        if attrs['related_order'].id in [order['related_order'] for order in FeedbackAndRating.objects.values('related_order')]:
            raise serializers.ValidationError('User already gave feedback for this order')

        return attrs
