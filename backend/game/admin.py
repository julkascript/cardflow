from django.contrib import admin

from game.models import Game


@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ('game_name',)
    list_filter = ('game_name',)
    search_fields = ('game_name',)

