from django.contrib import admin

from trade.models import Trade


@admin.register(Trade)
class TradeAdmin(admin.ModelAdmin):
    list_display = ('id', 'initiator', 'initiator_decision', 'recipient', 'recipient_decision',  'trade_status')
    list_filter = ('initiator', 'recipient', 'trade_status')
    search_fields = ('initiator', 'recipient')
