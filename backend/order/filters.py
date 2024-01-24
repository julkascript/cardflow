from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from django_filters import rest_framework as filters

from order.models import OrderItem, Order


class AdminListingFilter(admin.SimpleListFilter):
    title = _('listing name')  #
    parameter_name = 'listing_name'

    def lookups(self, request, model_admin):
        listings = set([item.listing for item in OrderItem.objects.all()])
        return [(listing.id, listing.card.yugioh_card) for listing in listings]

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(orderitem__listing__id=self.value())


class OrderFilter(filters.FilterSet):
    sender_user = filters.CharFilter(
        field_name='sender_user__username',
        lookup_expr='exact',
        label='Search by sender user'
    )

    receiver_user = filters.CharFilter(
        field_name='receiver_user__username',
        lookup_expr='exact',
        label='Search by receiver user'
    )

    status = filters.CharFilter(
        field_name='status',
        lookup_expr='exact',
        label='Search by status'
    )

    class Meta:
        model = Order
        fields = ['sender_user', 'receiver_user', 'status']
