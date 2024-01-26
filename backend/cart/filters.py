from django_filters import rest_framework as filters

from cart.models import ShoppingCartItem


class ShoppingCartItemFilter(filters.FilterSet):
    listing_username = filters.CharFilter(
        field_name='listing__user__username',
        lookup_expr='exact',
        label='Search by listing username'
    )

    class Meta:
        model = ShoppingCartItem

        fields = ['listing_username',]

