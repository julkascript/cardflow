from django.contrib import admin
from django.utils.translation import gettext_lazy as _

from order.models import OrderItem


class AdminListingFilter(admin.SimpleListFilter):
    title = _('listing name')  #
    parameter_name = 'listing_name'

    def lookups(self, request, model_admin):
        listings = set([item.listing for item in OrderItem.objects.all()])
        return [(listing.id, listing.card.yugioh_card) for listing in listings]

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(orderitem__listing__id=self.value())
