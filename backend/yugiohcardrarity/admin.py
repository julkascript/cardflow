from django.contrib import admin

from yugiohcardrarity.models import YugiohCardRarity


@admin.register(YugiohCardRarity)
class YugiohCardRarityAdmin(admin.ModelAdmin):
    list_display = ('set', 'rarity')
    list_filter = ('set', 'rarity')
    search_fields = ('set', 'rarity')
