from rest_framework import generics
from django_filters import rest_framework as filters
from .models import YugiohCard


class YugiohFilter(filters.FilterSet):
    card_name = filters.CharFilter(
        field_name='card_name',
        lookup_expr='icontains',
        label='Card name'
    )
    card_set = filters.CharFilter(
        field_name='yugiohcardinset__set__card_set_name',
        lookup_expr='icontains',
        label='Card set name'
    )

    class Meta:
        model = YugiohCard
        fields = ['card_name', 'card_set']
