from django.contrib import admin

from orders.models import Order


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    pass

# @admin.register(OrderItem)
# class OrderItem(admin.ModelAdmin):
#     pass
