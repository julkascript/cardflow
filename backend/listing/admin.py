from django.contrib import admin

from .models import Listing


@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = (
        'card',
        'price',
        'condition',
        'quantity',
        'is_listed',
        'is_sold',
    )

    list_filter = (
        # 'card__yugioh_card__card_name',
        'price',
        'condition',
        'quantity',
        'is_listed',
        'is_sold',
    )

    search_fields = (
        'card__yugioh_card__card_name',
        'condition',
        'quantity',
        'is_listed',
        'is_sold',
    )
