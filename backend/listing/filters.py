from django_filters import rest_framework as filters
from .models import Listing


class ListingFilter(filters.FilterSet):
    is_listed = filters.BooleanFilter(
        field_name='is_listed',
        lookup_expr='exact',
        label='Search by is_listed (true or false)',
    )

    class Meta:
        model = Listing
        fields = ['is_listed']
