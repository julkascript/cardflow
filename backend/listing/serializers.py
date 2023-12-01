from rest_framework import serializers
from .models import Listing


class ListingSerializer(serializers.ModelSerializer):
    card_name = serializers.CharField(read_only=True, source='card.yugioh_card')
    card_set_id = serializers.IntegerField(read_only=True, source='card.set.id')
    user_name = serializers.CharField(read_only=True, source='user.username')

    class Meta:
        model = Listing
        fields = ['id', 'card', 'card_name', 'card_set_id', 'user', 'user_name', 'price', 'condition', 'quantity',
                  'is_listed', 'is_sold']
        read_only_fields = ['id', 'user']
        ordering_fields = ['id']
