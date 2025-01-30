from django_filters import rest_framework as filters

from .models import Listing


class ListingFilter(filters.FilterSet):
    is_listed = filters.BooleanFilter(
        field_name='is_listed',
        lookup_expr='exact',
        label='Search by is_listed (true or false)',
    )

    is_sold = filters.BooleanFilter(
        field_name='is_sold',
        lookup_expr='exact',
        label='Search by is_sold (true or false)'
    )

    is_trade_considered = filters.BooleanFilter(
        field_name='is_trade_considered',
        lookup_expr='exact',
        label='Search by is_trade_considered (true or false)'
    )

    card_in_set_id = filters.NumberFilter(
        field_name='card',
        lookup_expr='exact',
        label='Search by card_set_id'
    )

    card_name = filters.Filter(
        field_name='card__yugioh_card__card_name',
        lookup_expr='icontains',
        label='Search by card name'
    )

    class Meta:
        model = Listing
        fields = ['card', 'is_listed', 'is_sold']

    @property
    def qs(self):
        request = self.request
        card_in_set_param = request.query_params.get('card_in_set_id', None)

        if card_in_set_param:
            return super().qs.filter(is_listed=True)

        return super().qs
