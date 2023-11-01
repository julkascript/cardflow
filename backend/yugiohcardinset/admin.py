from django.contrib import admin

from yugiohcardinset.models import YugiohCardInSet


@admin.register(YugiohCardInSet)
class YugiohCardInSetAdmin(admin.ModelAdmin):
    list_display = ('set', 'rarity')
    list_filter = ('set', 'rarity')
    search_fields = ('set', 'rarity')
