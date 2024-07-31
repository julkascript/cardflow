from django.contrib import admin

from trade.models import Trade


@admin.register(Trade)
class TradeAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'initiator', 'initiator_decision', 'initiator_cash', 'recipient', 'recipient_decision', 'recipient_cash',
        'trade_status'
    )
    list_filter = ('initiator', 'recipient', 'trade_status')
    search_fields = ('initiator', 'recipient')
