from django.contrib import admin

from .models import Card


@admin.register(Card)
class CardAdmin(admin.ModelAdmin):
    list_display = ('id', 'card_name', 'game')
    list_filter = ('card_name', 'game')
    search_fields = ('card_name', 'game')
    list_per_page = 25
