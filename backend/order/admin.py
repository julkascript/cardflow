from django.contrib import admin

from order.filters import AdminListingFilter
from order.models import Order, OrderItem, FeedbackAndRating, OrderStatusHistory


class OrderItemInline(admin.StackedInline):
    model = OrderItem
    extra = 1


@admin.register(OrderStatusHistory)
class OrderStatusHistoryAdmin(admin.ModelAdmin):
    pass


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    inlines = [OrderItemInline]
    list_display = (
        'id',
        'sender_user',
        'receiver_user',
        'status',
        'get_order_items',
        'delivery_address',
    )

    list_filter = (
        'sender_user',
        'receiver_user',
        'status',
        'delivery_address',
        AdminListingFilter,
    )

    search_fields = (
        'sender_user',
        'receiver_user',
        'status',
        'delivery_address',
    )

    def get_order_items(self, obj):
        return ' || '.join([str(listing) for listing in obj.orderitem_set.all()])

    get_order_items.short_description = 'Order Items'


@admin.register(FeedbackAndRating)
class FeedbackAndRatingAdmin(admin.ModelAdmin):
    list_display = (
        'receiver_user',
        'sender_user',
        'related_order',
        'rating',
        'comment',
    )

    list_filter = (
        'receiver_user',
        'sender_user',
        'rating',
    )

    search_fields = (
        'receiver_user',
        'sender_user',
        'rating',
    )
