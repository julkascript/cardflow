from rest_framework import serializers
from .models import Listing


class ListingSerializer(serializers.ModelSerializer):

    # card_name = serializers.CharField(source='card.yugioh_card.card_name')
    # user_name = serializers.CharField(source='user.username')

    class Meta:
        model = Listing
        fields = ['id', 'card', 'user', 'price', 'condition', 'quantity', 'is_listed', 'is_sold']
        read_only_fields = ['id', 'user']
        ordering_fields = ['id']
