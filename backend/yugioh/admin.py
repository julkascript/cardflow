from django.contrib import admin

from .models import YugiohCard, YugiohCardInSet, YugiohCardRarity, YugiohCardSet


@admin.register(YugiohCard)
class YugiohCardAdmin(admin.ModelAdmin):
    list_display = ['type', 'frame_type', 'description', 'attack', 'defense', 'level', 'race', 'attribute', 'archetype']
    list_filter = ['type', 'frame_type', 'description', 'attack', 'defense', 'level', 'race', 'attribute', 'archetype']
    search_fields = ['type', 'frame_type', 'description', 'attack', 'defense', 'level', 'race', 'attribute', 'archetype']


@admin.register(YugiohCardInSet)
class YugiohCardInSetAdmin(admin.ModelAdmin):
    list_display = ('set_name', 'rarity_name')
    list_filter = 'set__card_set_name', 'rarity__rarity'

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


@admin.register(YugiohCardSet)
class YugiohCardSetAdmin(admin.ModelAdmin):
    list_display = ('card_set_name', 'card_set_code')
    list_filter = ('card_set_name', 'card_set_code')
    search_fields = ('card_set_name', 'card_set_code')
