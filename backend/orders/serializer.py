from rest_framework import serializers

from listing.serializers import ListingSerializer
from orders.models import Order


#
# class OrderItemSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = OrderItem
#         fields = ('listing',)
#

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'

    def create(self, validated_data):
        listings_data = validated_data.pop('listings')
        order = Order.objects.create(**validated_data)

        listing_serializer = ListingSerializer(data=listings_data)
        if listing_serializer.is_valid():
            listing_serializer.save(order=order)
        else:
            order.delete()
            raise serializers.ValidationError(listing_serializer.errors)

        return order
