from yugioh.serializers import YugiohCardInSetSerializer
from rest_framework import serializers
from .models import Listing


class ListingSerializer(serializers.ModelSerializer):
    card_name = serializers.CharField(read_only=True, source='card.yugioh_card')
    card_set_id = serializers.IntegerField(read_only=True, source='card.set.id')
    card_in_set = YugiohCardInSetSerializer(read_only=True, source='card')
    user_name = serializers.CharField(read_only=True, source='user.username')
    price = serializers.FloatField()

    class Meta:
        model = Listing
        fields = ['id', 'card', 'card_name', 'card_set_id', 'card_in_set', 'user', 'user_name',
                  'price', 'condition', 'quantity', 'is_listed', 'is_sold']
        read_only_fields = ['id', 'user']
        ordering_fields = ['id']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        request = self.context.get('request')
        if request:
            user = request.user
            if user.is_authenticated and user.currency_preference == 'EUR':
                representation['price'] = round(instance.price * 0.511292, 2)
        return representation

    def create(self, validated_data):
        request = self.context.get('request')
        if request:
            user = request.user
            if user.is_authenticated and user.currency_preference == 'EUR':
                validated_data['price'] = round(validated_data['price'] * 1.95583, 2)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        request = self.context.get('request')
        if request:
            user = request.user
            if user.is_authenticated and user.currency_preference == 'EUR':
                validated_data['price'] = round(validated_data['price'] * 1.95583, 2)
        return super().update(instance, validated_data)


class ListingSearchSerializer(serializers.ModelSerializer):

    # price = serializers.SerializerMethodField()

    class Meta:
        model = Listing
        fields = ['id', 'card', 'card_name', 'card_set_id', 'user', 'user_name', 'price', 'condition', 'quantity',
                  'is_listed', 'is_sold']
        read_only_fields = ['id', 'user']
        ordering_fields = ['id']

    # def get_price(self, obj):
    #     request = self.context.get('request')
    #     if request:
    #         user = request.user
    #         if user.is_authenticated and user.currency_preference == 'EUR':
    #             return round(obj.price * 0.51, 2)
    #     return obj.price
