from rest_framework import serializers, exceptions

from accounts.serializers import UserSerializer
from cart.models import ShoppingCart, ShoppingCartItem
from listing.models import Listing
from listing.serializers import ListingSerializer


class ShoppingCartSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    # orders = OrderSerializer(many=True)

    class Meta:
        model = ShoppingCart
        fields = '__all__'


class ShoppingCartItemSerializer(serializers.ModelSerializer):
    listing = ListingSerializer()

    class Meta:
        model = ShoppingCartItem
        fields = ['id', 'listing', 'quantity', 'total_price']


class WriteShoppingCartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShoppingCartItem
        fields = ['id', 'listing_id', 'quantity']

    listing_id = serializers.IntegerField()

    def validate_product_id(self, listing_id):
        if not Listing.objects.filter(pk=listing_id).exists():
            raise serializers.ValidationError('No product with the given id was found')
        return listing_id

    def update(self, cart_item, validated_data):
        if validated_data['quantity'] > cart_item.listing.quantity:
            raise exceptions.ValidationError()
        return super().update(cart_item, validated_data)

    def save(self, **kwargs):
        cart = self.context['cart']

        if self.instance is not None:
            self.update(self.instance, self.validated_data)
            return self.instance

        listing_id = self.validated_data['listing_id']
        quantity = self.validated_data['quantity']
        try:
            cart_item = ShoppingCartItem.objects.get(cart=cart, listing_id=listing_id)
            cart_item.quantity += quantity
        except ShoppingCartItem.DoesNotExist:
            cart_item = ShoppingCartItem(cart=cart, **self.validated_data)

        if cart_item.quantity > cart_item.listing.quantity:
            raise exceptions.ValidationError()

        cart_item.save()
        self.instance = cart_item
        return self.instance
