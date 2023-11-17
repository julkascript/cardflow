from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers
from .models import YugiohCard, YugiohCardInSet, YugiohCardSet, YugiohCardRarity


class YugiohCardSetSerializer(serializers.ModelSerializer):
    class Meta:
        model = YugiohCardSet
        fields = ['id', 'card_set_name', 'set_code']
        read_only_fields = ['card_set_name', 'set_code']


class YugiohCardRaritySerializer(serializers.ModelSerializer):
    class Meta:
        model = YugiohCardRarity
        fields = ['id', 'rarity', 'rarity_code']
        read_only_fields = ['rarity', 'rarity_code']


class YugiohCardSerializer(serializers.ModelSerializer):
    rarity = serializers.SerializerMethodField()
    set = serializers.SerializerMethodField()

    class Meta:
        model = YugiohCard
        fields = [
            'id',
            'card_name',
            'type',
            'frame_type',
            'description',
            'attack',
            'defense',
            'level',
            'race',
            'attribute',
            'archetype',
            'rarity',
            'set',
            'image',
        ]
        search_fields = ['card_name', 'set']
        read_only_fields = ['id', 'set', 'rarity']
        ordering_fields = ['id']

    @staticmethod
    @extend_schema_field(YugiohCardRaritySerializer)
    def get_rarity(obj):
        all_card_rarities = YugiohCardInSetSerializer(YugiohCardInSet.objects.filter(yugioh_card=obj), many=True).data
        card_rarities = [rarity['rarity'] for rarity in all_card_rarities]

        return card_rarities

    @staticmethod
    @extend_schema_field(YugiohCardSetSerializer)
    def get_set(obj):
        all_card_sets = YugiohCardInSetSerializer(YugiohCardInSet.objects.filter(yugioh_card=obj), many=True).data
        card_sets = [set_name['set'] for set_name in all_card_sets]

        return card_sets


class YugiohCardInSetCardSerializer(YugiohCardSerializer):
    class Meta(YugiohCardSerializer.Meta):
        fields = [
            'id',
            'card_name',
            'type',
            'frame_type',
            'description',
            'attack',
            'defense',
            'level',
            'race',
            'attribute',
            'archetype',
            'image',
        ]


class YugiohCardInSetSerializer(serializers.ModelSerializer):
    rarity = YugiohCardRaritySerializer(read_only=True)
    set = YugiohCardSetSerializer(read_only=True)
    yugioh_card = YugiohCardInSetCardSerializer(read_only=True)

    class Meta:
        model = YugiohCardInSet
        fields = ['id', 'yugioh_card', 'set', 'rarity']
        read_only_fields = ['id', 'rarity', 'set', 'yugioh_card']
        ordering_fields = ['id']
