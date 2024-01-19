from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, permissions

from cart.models import ShoppingCart, ShoppingCartItem
from cart.serializers import WriteShoppingCartItemSerializer, ShoppingCartItemSerializer


def get_cart_for_user(user):
    cart, created = ShoppingCart.objects.get_or_create(user=user)

    return cart


@extend_schema(tags=['ShoppingCart'])
class ShoppingCartItemViewSet(viewsets.ModelViewSet):

    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ShoppingCartItem.objects.filter(cart=get_cart_for_user(self.request.user))

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['cart'] = get_cart_for_user(self.request.user)
        return context

    def get_serializer_class(self, *args, **kwargs):
        if self.action in ['create', 'partial_update']:
            return WriteShoppingCartItemSerializer
        else:
            return ShoppingCartItemSerializer
