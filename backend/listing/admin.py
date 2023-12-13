from django.contrib import admin

from .models import Listing


@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = (
        'card',
        'user',
        'price',
        'condition',
        'quantity',
        'is_listed',
        'is_sold',
        'id',
    )

    list_filter = (
        # 'card__yugioh_card__card_name',
        'user__username',
        'price',
        'condition',
        'quantity',
        'is_listed',
        'is_sold',
    )

    search_fields = (
        'card__yugioh_card__card_name',
        'user__username',
        'condition',
        'quantity',
        'is_listed',
        'is_sold',
    )

    ordering = ('id',)
