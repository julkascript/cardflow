from rest_framework import serializers, exceptions

from accounts.serializers import UserSerializer
from cart.models import ShoppingCart, ShoppingCartItem
from listing.models import Listing
from listing.serializers import ListingSerializer


class ShoppingCartSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = ShoppingCart
        fields = '__all__'
        ordering_fields = ['id']


class ShoppingCartItemSerializer(serializers.ModelSerializer):
    listing = ListingSerializer()
    cart_name = serializers.CharField(read_only=True, source='cart.user.username')

    class Meta:
        model = ShoppingCartItem
        fields = ['id', 'cart_name', 'listing', 'quantity', 'total_price']
        ordering_fields = ['id']


class AddShoppingCartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShoppingCartItem
        fields = ['id', 'listing_id', 'quantity']

    listing_id = serializers.IntegerField()

    def validate_listing_id(self, listing_id):
        if not Listing.objects.filter(pk=listing_id).exists():
            raise serializers.ValidationError('No product with the given id was found')

        listing = Listing.objects.get(pk=listing_id)

        if listing.is_sold:
            raise serializers.ValidationError('This listing is already sold and cannot be added to the cart.')

        if listing.user == self.context['cart'].user:
            raise serializers.ValidationError('You cant add this item to the cart.')

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
            cart_item.quantity = quantity

        except ShoppingCartItem.DoesNotExist:
            cart_item = ShoppingCartItem(cart=cart, **self.validated_data)

            if cart_item.quantity > cart_item.listing.quantity:
                raise exceptions.ValidationError()

        cart_item.save()
        self.instance = cart_item
        return self.instance


class CheckoutSerializer(serializers.Serializer):
    delivery_address = serializers.CharField(required=True)
    phone_number = serializers.CharField(required=True)
    names = serializers.CharField(required=True)
