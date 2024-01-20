from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, permissions

from cart.models import ShoppingCart, ShoppingCartItem
from cart.permissions import IsItemOwner
from cart.serializers import WriteShoppingCartItemSerializer, ShoppingCartItemSerializer


def get_cart_for_user(user):
    if user.is_anonymous:
        return None

    cart, created = ShoppingCart.objects.get_or_create(user=user)

    return cart


@extend_schema(tags=['ShoppingCartItem'], )
class ShoppingCartItemViewSet(viewsets.ModelViewSet):
    queryset = ShoppingCartItem.objects.all().order_by('id')
    permission_classes = [IsItemOwner, permissions.IsAuthenticated]

    def get_queryset(self):

        if self.request.user.is_anonymous:
            return super().get_queryset()

        return ShoppingCartItem.objects.filter(cart=get_cart_for_user(self.request.user)).order_by('id')

    def get_serializer_context(self):
        context = super().get_serializer_context()
        if self.request.user.is_anonymous:
            return context
        context['cart'] = get_cart_for_user(self.request.user)
        return context

    def get_serializer_class(self, *args, **kwargs):
        if self.action in ['create', 'partial_update']:
            return WriteShoppingCartItemSerializer
        else:
            return ShoppingCartItemSerializer

