from django.contrib import admin

from yugiohcardset.models import YugiohCardSet


@admin.register(YugiohCardSet)
class YugiohCardSetAdmin(admin.ModelAdmin):
    list_display = ('card_set_name',)
    list_filter = ('card_set_name',)
    search_fields = ('card_set_name',)
