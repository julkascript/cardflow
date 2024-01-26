from django.contrib import admin

from cart.models import ShoppingCart, ShoppingCartItem


class ShoppingCartItemInline(admin.StackedInline):
    model = ShoppingCartItem
    extra = 1


@admin.register(ShoppingCart)
class ShoppingCartAdmin(admin.ModelAdmin):
    inlines = [ShoppingCartItemInline]


@admin.register(ShoppingCartItem)
class ShoppingCartItemAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'listing',
        'quantity',
        'cart',
    )
