from django.contrib import admin

from yugiohcardset.models import YugiohCardSet


@admin.register(YugiohCardSet)
class YugiohCardSetAdmin(admin.ModelAdmin):
    list_display = ('card_set_name', 'card_in_set')
    list_filter = ('card_set_name', 'card_in_set')
    search_fields = ('card_set_name', 'card_in_set')
