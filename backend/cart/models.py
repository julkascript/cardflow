from django.contrib.auth import get_user_model
from django.db import models

from order.models import Order

User = get_user_model()


class ShoppingCart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    orders = models.ManyToManyField(Order)

    def __str__(self):
        return f'{self.user} shopping Cart'
