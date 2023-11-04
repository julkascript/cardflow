from django.contrib import admin

from yugiohcardrarity.models import YugiohCardRarity


@admin.register(YugiohCardRarity)
class YugiohCardRarityAdmin(admin.ModelAdmin):
    list_display = ('rarity',)
    list_filter = ('rarity',)
    search_fields = ('rarity',)
