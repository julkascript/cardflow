from django.contrib.auth import get_user_model
from django.db import transaction
from django.test import RequestFactory
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from cart.models import ShoppingCart, ShoppingCartItem
from cart.permissions import IsItemOwner
from cart.serializers import AddShoppingCartItemSerializer, ShoppingCartItemSerializer, CheckoutSerializer
from listing.models import Listing
from listing.views import BuyListingViewSet
from order.models import Order

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
            return AddShoppingCartItemSerializer
        else:
            return ShoppingCartItemSerializer

    @extend_schema(
        request=CheckoutSerializer,
        responses={status.HTTP_201_CREATED: CheckoutSerializer},
        description="Checkout and create orders based on user's cart items."
    )
    @action(detail=False, methods=['post'])
    def checkout(self, request, *args, **kwargs):
        """
        Checkout and create orders based on user's cart items grouped by sender.
        """
        serializer = CheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        delivery_address = serializer.validated_data['delivery_address']

        cart_items = ShoppingCartItem.objects.filter(cart=get_cart_for_user(request.user))

        if not cart_items:
            return Response({'error': 'No items for checkout'}, status=status.HTTP_400_BAD_REQUEST)

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
                sender = User.objects.filter(pk=sender_user.id).first()

                order_data = {
                    'sender_user': sender,
                    'receiver_user': self.request.user,
                    'status': 'ordered',
                    'delivery_address': delivery_address,
                }

                order = Order.objects.create(**order_data)

                order.listing.set([cart_item.listing for cart_item in grouped_cart_items])

                orders.append(order.id)

                # Decrement quantity from the listing after successful transaction
                for cart_item in grouped_cart_items:
                    listing = cart_item.listing

                    updated_quantity = listing.quantity - cart_item.quantity

                    Listing.objects.filter(pk=listing.pk).update(quantity=updated_quantity)

                    updated_listing = Listing.objects.get(pk=listing.pk)

                    if updated_listing.quantity == 0:

                        # make Request to BuyListingViewSet
                        factory = RequestFactory()
                        put_request = factory.put(f'/{updated_listing.pk}/buy/')
                        put_request.user = self.request.user

                        buy_listing_viewset = BuyListingViewSet()
                        buy_listing_viewset.request = put_request
                        buy_listing_viewset.kwargs = {'pk': updated_listing.pk}
                        buy_listing_viewset.format_kwarg = None

                        response = buy_listing_viewset.mark_as_sold(put_request)

                        if response.status_code != status.HTTP_200_OK:
                            raise Exception('Failed to mark listing as sold')

            # Delete cart items after successful checkout
            cart_items.delete()

        return Response({'message': 'Checkout successful', 'orders': orders}, status=status.HTTP_201_CREATED)
