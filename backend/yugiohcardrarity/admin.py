from django.contrib import admin

from yugiohcardrarity.models import YugiohCardRarity


@admin.register(YugiohCardRarity)
class YugiohCardRarityAdmin(admin.ModelAdmin):
    list_display = ('rarity', 'rarity_code')
    list_filter = ('rarity', 'rarity_code')
    search_fields = ('rarity', 'rarity_code')
