from yugioh.serializers import YugiohCardInSetSerializer
from rest_framework import serializers
from .models import Listing


class ListingSerializer(serializers.ModelSerializer):
    card_name = serializers.CharField(read_only=True, source='card.yugioh_card')
    card_set_id = serializers.IntegerField(read_only=True, source='card.set.id')
    card_in_set = YugiohCardInSetSerializer(read_only=True, source='card')
    user_name = serializers.CharField(read_only=True, source='user.username')

    class Meta:
        model = Listing
        fields = ['id', 'card', 'card_name', 'card_set_id', 'card_in_set','user', 'user_name', 'price', 'condition', 'quantity',
                  'is_listed', 'is_sold']
        read_only_fields = ['id', 'user']
        ordering_fields = ['id']


class ListingSearchSerializer(serializers.ModelSerializer):

    class Meta:
        model = Listing
        fields = ['id', 'card', 'card_name', 'card_set_id', 'user', 'user_name', 'price', 'condition', 'quantity',
                  'is_listed', 'is_sold']
        read_only_fields = ['id', 'user']
        ordering_fields = ['id']
