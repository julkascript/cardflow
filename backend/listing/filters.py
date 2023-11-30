from django_filters import rest_framework as filters
from .models import Listing


class ListingFilter(filters.FilterSet):
    card_listed = filters.BooleanFilter(
        field_name='is_listed',
        lookup_expr='exact',
        label='Search by is_listed',
    )

    class Meta:
        model = Listing
        fields = ['card_listed']
