from django_filters import rest_framework as filters
from django.forms.widgets import TextInput
from .models import YugiohCard


class YugiohFilter(filters.FilterSet):
    card_name = filters.CharFilter(
        field_name='card_name',
        lookup_expr='icontains',
        label='Card name',
        widget=TextInput(attrs={'placeholder': 'Search by card name'})
    )

    set_name = filters.CharFilter(
        field_name='yugiohcardinset__set__card_set_name',
        lookup_expr='icontains',
        label='Search by set name',
        widget=TextInput(attrs={'placeholder': 'set name...'})
    )

    class Meta:
        model = YugiohCard
        fields = ['card_name', 'set_name']
