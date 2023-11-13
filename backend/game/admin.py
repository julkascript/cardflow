from django.contrib import admin

from .models import Game


@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ('game_name', 'count_cards')
    list_filter = ('game_name',)
    search_fields = ('game_name',)

    def count_cards(self, obj):
        return obj.card_set.count()

    count_cards.short_description = 'Cards'
