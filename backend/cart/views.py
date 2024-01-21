from django.contrib.auth import get_user_model
from django.db import transaction
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from cart.models import ShoppingCart, ShoppingCartItem
from cart.permissions import IsItemOwner
from cart.serializers import WriteShoppingCartItemSerializer, ShoppingCartItemSerializer
from order.models import Order
from order.serializer import OrderSerializer

User = get_user_model()

def get_cart_for_user(user):
    # This statement is added for preventing Swagger from infinity loop
    if user.is_anonymous:
        return None

    cart, created = ShoppingCart.objects.get_or_create(user=user)

    return cart


@extend_schema(tags=['ShoppingCartItem'], )
class ShoppingCartItemViewSet(viewsets.ModelViewSet):
    queryset = ShoppingCartItem.objects.all().order_by('id')
    permission_classes = [IsItemOwner, permissions.IsAuthenticated]

    def get_queryset(self):

        # This statement is added for preventing Swagger from infinity loop
        if self.request.user.is_anonymous:
            return super().get_queryset()

        return ShoppingCartItem.objects.filter(cart=get_cart_for_user(self.request.user)).order_by('id')

    def get_serializer_context(self):
        context = super().get_serializer_context()

        # This statement is added for preventing Swagger from infinity loop
        if self.request.user.is_anonymous:
            return context

        context['cart'] = get_cart_for_user(self.request.user)
        return context

    def get_serializer_class(self, *args, **kwargs):
        if self.action in ['create', 'partial_update']:
            return WriteShoppingCartItemSerializer
        else:
            return ShoppingCartItemSerializer

    @extend_schema(
        request=None,  # Set request to None to indicate an empty request body
        responses={status.HTTP_201_CREATED: OrderSerializer(many=True)},
        description="Checkout and create orders based on user's cart items."
    )
    @action(detail=False, methods=['post'])
    def checkout(self, request, *args, **kwargs):
        """
        Checkout and create orders based on user's cart items.
        """
        cart_items = ShoppingCartItem.objects.filter(cart=get_cart_for_user(request.user))

        orders = []

        with transaction.atomic():
            # Create a dictionary to group cart items by sender user
            cart_items_by_sender = {}

            for cart_item in cart_items:
                sender_user = cart_item.listing.user

                if sender_user not in cart_items_by_sender:
                    cart_items_by_sender[sender_user] = []

                cart_items_by_sender[sender_user].append(cart_item)

            # Process each group of cart items
            for sender_user, grouped_cart_items in cart_items_by_sender.items():

                sender = User.object.get(pk=sender_user.user)
                order_data = {
                    'sender_user': sender_user.id,  # Use the primary key of the sender user
                    'receiver_user': self.request.user.id,  # Use the primary key of the receiver user
                    'status': 'ordered',
                    'delivery_address': request.data.get('delivery_address', ''),
                }

                order = Order.objects.create(**order_data)

                # Add listings from the cart to the order
                order.listing.set([cart_item.listing for cart_item in grouped_cart_items])

                orders.append(order.id)

            # Delete cart items after successful checkout
            cart_items.delete()

        return Response({'message': 'Checkout successful', 'orders': orders}, status=status.HTTP_201_CREATED)