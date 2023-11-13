from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers
from .models import YugiohCard, YugiohCardInSet, YugiohCardSet, YugiohCardRarity


class YugiohCardRaritySerializer(serializers.ModelSerializer):
    class Meta:
        model = YugiohCardRarity
        fields = ['rarity', 'rarity_code']


class YugiohCardSetSerializer(serializers.ModelSerializer):
    class Meta:
        model = YugiohCardSet
        fields = ['card_set_name', 'set_code']
        read_only_fields = ['card_set_name', 'set_code']


class YugiohCardInSetSerializer(serializers.ModelSerializer):
    class Meta:
        model = YugiohCardInSet
        fields = ['rarity', 'set', 'yugioh_card']
        read_only_fields = ['rarity', 'set', 'yugioh_card']


class YugiohSerializer(serializers.ModelSerializer):
    rarity = serializers.SerializerMethodField()
    set = serializers.SerializerMethodField()

    class Meta:
        model = YugiohCard
        fields = [
            'id',
            'card_name',
            'rarity',
            'set',
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
        read_only_fields = ['id', 'set', 'rarity']
        ordering_fields = ['id']

    @staticmethod
    @extend_schema_field(YugiohCardSetSerializer)
    def get_rarity(obj):
        cards = YugiohCardInSet.objects.filter(yugioh_card=obj)
        all_rarities = YugiohCardInSetSerializer(cards, many=True).data
        if len(all_rarities) == 0:
            return None

        rarity_ids = [rarity['rarity'] for rarity in all_rarities]
        rarity_names = [
            f'{YugiohCardRarity.objects.get(id=rarity_id).rarity}{YugiohCardRarity.objects.get(id=rarity_id).rarity_code}'
            for rarity_id in rarity_ids]
        return rarity_names

    @staticmethod
    @extend_schema_field(YugiohCardSetSerializer)
    def get_set(obj):
        sets = YugiohCardInSet.objects.filter(yugioh_card=obj)
        all_sets = YugiohCardInSetSerializer(sets, many=True).data
        if len(all_sets) == 0:
            return None

        all_sets_ids = [set_name['set'] for set_name in all_sets]
        set_names = [
            f'{YugiohCardSet.objects.get(id=set_id).card_set_name}({YugiohCardSet.objects.get(id=set_id).set_code})' for
            set_id in all_sets_ids]
        return set_names
