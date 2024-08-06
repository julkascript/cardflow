from django.contrib import admin

from trade.models import Trade


@admin.register(Trade)
class TradeAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'initiator', 'initiator_decision', 'initiator_cash', 'get_initiator_listing', 'recipient',
        'recipient_decision', 'get_recipient_listing', 'recipient_cash',
        'trade_status'
    )
    list_filter = ('initiator', 'recipient', 'trade_status')
    search_fields = ('initiator', 'recipient')

    def get_initiator_listing(self, obj):
        return ', '.join([str(l) for l in obj.initiator_listing.all()])

    def get_recipient_listing(self, obj):
        return ', '.join([str(l) for l in obj.recipient_listing.all()])

    get_initiator_listing.short_description = 'Initiator Listing'
    get_recipient_listing.short_description = 'Recipient Listing'
