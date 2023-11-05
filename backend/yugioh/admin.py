from django.contrib import admin

from .models import YugiohCard, YugiohCardInSet, YugiohCardRarity, YugiohCardSet
from card.models import Card


@admin.register(YugiohCard)
class YugiohCardAdmin(admin.ModelAdmin):
    list_display = ['get_card_name', 'type', 'frame_type', 'description', 'attack', 'defense', 'level', 'race',
                    'attribute', 'archetype']
    list_filter = ['card__card_name', 'type', 'frame_type', 'description', 'attack', 'defense', 'level', 'race',
                   'attribute', 'archetype']
    search_fields = ['card__card_name', 'type', 'frame_type', 'description', 'attack', 'defense', 'level', 'race',
                     'attribute', 'archetype']
    list_per_page = 25

    def get_card_name(self, obj):
        return obj.card.card_name


@admin.register(YugiohCardInSet)
class YugiohCardInSetAdmin(admin.ModelAdmin):
    list_display = ('set_name', 'rarity_name')
    list_filter = ('set__card_set_name', 'rarity__rarity')
    search_fields = ('set__card_set_name', 'rarity__rarity')
    list_per_page = 25

    def set_name(self, obj):
        return obj.set.card_set_name

    def rarity_name(self, obj):
        return obj.rarity


@admin.register(YugiohCardRarity)
class YugiohCardRarityAdmin(admin.ModelAdmin):
    pass
    list_display = ('rarity', 'rarity_code')
    list_filter = ('rarity', 'rarity_code')
    search_fields = ('rarity', 'rarity_code')
    list_per_page = 25


@admin.register(YugiohCardSet)
class YugiohCardSetAdmin(admin.ModelAdmin):
    list_display = ('card_set_name', 'set_code')
    list_filter = ('card_set_name', 'set_code')
    search_fields = ('card_set_name', 'set_code')
    list_per_page = 25
