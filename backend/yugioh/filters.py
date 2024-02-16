from django_filters import rest_framework as filters

from .models import YugiohCard, YugiohCardInSet


class YugiohCardFilter(filters.FilterSet):
    card_name = filters.CharFilter(
        field_name='card_name',
        lookup_expr='icontains',
        label='Search by card name',
    )

    class Meta:
        model = YugiohCard
        fields = ['card_name']


class YugiohCardInSetFilter(filters.FilterSet):
    card_name = filters.CharFilter(
        field_name='yugioh_card__card_name',
        lookup_expr='icontains',
        label='Search by card name',
    )

    class Meta:
        model = YugiohCardInSet
        fields = ['yugioh_card']
