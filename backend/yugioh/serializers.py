from django.db.models import Min
from drf_spectacular.utils import extend_schema_field
from rest_framework import serializers

from listing.models import Listing
from .models import YugiohCard, YugiohCardInSet, YugiohCardSet, YugiohCardRarity


class YugiohCardSetSerializer(serializers.ModelSerializer):
    class Meta:
        model = YugiohCardSet
        fields = ["id", "card_set_name", "set_code"]
        read_only_fields = ["card_set_name", "set_code"]


class YugiohCardRaritySerializer(serializers.ModelSerializer):
    class Meta:
        model = YugiohCardRarity
        fields = ["id", "rarity", "rarity_code"]
        read_only_fields = ["rarity", "rarity_code"]


class YugiohCardSerializer(serializers.ModelSerializer):
    card_in_sets = serializers.SerializerMethodField()

    class Meta:
        model = YugiohCard
        fields = [
            "id",
            "card_name",
            "type",
            "frame_type",
            "description",
            "attack",
            "defense",
            "level",
            "race",
            "attribute",
            "archetype",
            "image",
            "card_in_sets",
        ]
        search_fields = ["card_name"]
        read_only_fields = ["id", "card_in_sets"]
        ordering_fields = ["card_name"]

    @staticmethod
    @extend_schema_field(YugiohCardSetSerializer)
    def get_card_in_sets(obj):
        all_card_in_sets = YugiohCardInSetSerializer(
            YugiohCardInSet.objects.filter(yugioh_card=obj), many=True
        ).data
        card_in_sets = []
        set_names = [set_name["set"] for set_name in all_card_in_sets]
        rarity_names = [rarity["rarity"] for rarity in all_card_in_sets]
        card_in_set_id = [rarity["id"] for rarity in all_card_in_sets]

        for set_name, rarity_name, card_in_set_id in zip(
                set_names, rarity_names, card_in_set_id
        ):
            card_in_sets.append(
                {
                    "set": set_name,
                    "rarity": rarity_name,
                    "card_in_set_id": card_in_set_id,
                }
            )

        return card_in_sets


class YugiohCardInSetCardSerializer(YugiohCardSerializer):
    class Meta(YugiohCardSerializer.Meta):
        fields = [
            "id",
            "card_name",
            "type",
            "frame_type",
            "description",
            "attack",
            "defense",
            "level",
            "race",
            "attribute",
            "archetype",
            "image",
        ]


class YugiohCardInSetSerializer(serializers.ModelSerializer):
    rarity = YugiohCardRaritySerializer(read_only=True)
    set = YugiohCardSetSerializer(read_only=True)
    yugioh_card = YugiohCardInSetCardSerializer(read_only=True)

    class Meta:
        model = YugiohCardInSet
        fields = ["id", "yugioh_card", "set", "rarity"]
        read_only_fields = ["id", "rarity", "set", "yugioh_card"]
        ordering_fields = ["id"]


class BestSellerCardSerializer(serializers.ModelSerializer):
    card_name = serializers.CharField(source="card.yugioh_card.card_name")
    set_name = serializers.CharField(source="card.set.card_set_name")
    set_code = serializers.CharField(source="card.set.set_code")
    card_image = serializers.SerializerMethodField()
    lowest_price = serializers.SerializerMethodField()

    class Meta:
        model = Listing
        fields = [
            "card_name",
            "set_name",
            "set_code",
            "card_image",
            "lowest_price",
            "card_id",
        ]

    @staticmethod
    def get_card_image(obj):
        return obj.card.yugioh_card.image

    @staticmethod
    def get_lowest_price(obj):
        lowest_price = Listing.objects.filter(card=obj.card).aggregate(Min("price"))[
            "price__min"
        ]
        return lowest_price


class TrendingCardSerializer(serializers.Serializer):
    card_id = serializers.IntegerField()
    card_name = serializers.CharField(source="card.yugioh_card.card_name")
    set_name = serializers.CharField(source="card.set.card_set_name")
    set_code = serializers.CharField(source="card.set.set_code")
    card_image = serializers.SerializerMethodField()
    lowest_price = serializers.SerializerMethodField()
    total_purchases = serializers.SerializerMethodField()

    class Meta:
        model = Listing
        fields = [
            "card_name",
            "set_name",
            "set_code",
            "card_image",
            "lowest_price",
            "card_id",
            "total_purchases"
        ]

    @staticmethod
    def get_card_image(obj):
        return obj.card.yugioh_card.image

    @staticmethod
    def get_lowest_price(obj):
        lowest_price = Listing.objects.filter(card=obj.card).aggregate(Min("price"))[
            "price__min"
        ]
        return lowest_price

    @staticmethod
    def get_total_purchases(obj):
        return obj.order_count
