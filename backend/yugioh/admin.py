from django.contrib import admin

from .models import YugiohCard, YugiohCardInSet, YugiohCardRarity, YugiohCardSet


@admin.register(YugiohCard)
class YugiohCardAdmin(admin.ModelAdmin):
    list_display = ['card_name', 'type', 'frame_type', 'attack', 'defense', 'level', 'race',
                    'attribute', 'archetype', 'description']
    list_filter = ['card_name', 'type', 'frame_type', 'attack', 'defense', 'level', 'race',
                   'attribute', 'archetype']
    search_fields = ['card_name', 'type', 'frame_type', 'attack', 'defense', 'level', 'race',
                     'attribute', 'archetype']
    list_per_page = 25


@admin.register(YugiohCardInSet)
class YugiohCardInSetAdmin(admin.ModelAdmin):
    list_display = ('yugioh_card', 'set_name', 'rarity_name', 'id')
    list_filter = ('yugioh_card__card_name', 'set__card_set_name', 'rarity__rarity')
    search_fields = ('yugioh_card__card_name', 'set__card_set_name', 'rarity__rarity', 'id')
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
    list_display = ('card_set_name', 'set_code', 'id')
    list_filter = ('card_set_name', 'set_code')
    search_fields = ('card_set_name', 'set_code')
    list_per_page = 25
