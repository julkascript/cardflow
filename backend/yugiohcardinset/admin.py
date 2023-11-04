from django.contrib import admin

from yugiohcardinset.models import YugiohCardInSet


@admin.register(YugiohCardInSet)
class YugiohCardInSetAdmin(admin.ModelAdmin):
    list_display = ('set_name', 'rarity_name')
    list_filter = 'set__card_set_name', 'rarity__rarity'

    def set_name(self, obj):
        return obj.set.card_set_name

    def rarity_name(self, obj):
        return obj.rarity
