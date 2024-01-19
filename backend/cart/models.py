from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator
from django.db import models

from listing.models import Listing
from order.models import Order

User = get_user_model()


class ShoppingCart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return f'ShoppingCart of {self.user}'


class ShoppingCartItem(models.Model):
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['cart', 'listing'], name='unique_listing_in_cart')
        ]

    cart = models.ForeignKey(ShoppingCart, on_delete=models.CASCADE)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(1)])

    @property
    def total_price(self):
        return self.quantity * self.listing.price

    def __str__(self):
        return f'{self.cart.user} - {self.listing} /item'
