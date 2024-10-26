from django.contrib import admin

from trade.models import Trade, ChatMessage, TradeChat


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


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'trade', 'sender', 'sender_type', 'created_at')
    list_filter = ('sender', 'created_at')
    search_fields = ('sender',)
    list_display_links = ('id', 'trade')


    def trade(self, obj):
        return obj.trade_chat

    trade.short_description = 'Trade chat ID'


@admin.register(TradeChat)
class TradeChatAdmin(admin.ModelAdmin):
    list_display = ('id', 'trade_id', 'created_at', 'count_messages')
    list_filter = ('trade_id', 'created_at')
    search_fields = ('trade_id',)

    def trade_id(self, obj):
        return obj.trade

    def count_messages(self, obj):
        return obj.messages.count()

    count_messages.short_description = 'Messages'
