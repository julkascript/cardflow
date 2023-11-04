from django.contrib import admin

from yugioh.models import YugiohCard


@admin.register(YugiohCard)
class YugiohCardAdmin(admin.ModelAdmin):
    list_display = ['type', 'frame_type', 'description', 'attack', 'defense', 'level', 'race', 'attribute', 'archetype']
    list_filter = ['type', 'frame_type', 'description', 'attack', 'defense', 'level', 'race', 'attribute', 'archetype']
    search_fields = ['type', 'frame_type', 'description', 'attack', 'defense', 'level', 'race', 'attribute', 'archetype']
