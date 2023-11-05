from django.contrib import admin

from .models import Card


@admin.register(Card)
class CardAdmin(admin.ModelAdmin):
    list_display = ('card_name', 'game', 'id')
    list_filter = ('card_name', 'game')
    search_fields = ('card_name', 'game__game_name')
    list_per_page = 25
