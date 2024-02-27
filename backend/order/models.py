from django.contrib.auth import get_user_model
from django.core.validators import MaxValueValidator
from django.db import models

from listing.models import Listing

User = get_user_model()


class Order(models.Model):
    STATUS_CHOICES = [
        ('in_cart', 'In Cart'),
        ('ordered', 'Ordered'),
        ('sent', 'Sent'),
        ('received', 'Received'),

        ('completed', 'Completed'),
        ('rejected', 'Rejected'),
    ]

    STATUS_CHOICES_MAX_LENGTH = max(len(c[0]) for c in STATUS_CHOICES)
    DELIVERY_ADDRESS_MAX_LENGTH = 255

    sender_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sender_user')
    receiver_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='receiver_user')

    status = models.CharField(
        max_length=STATUS_CHOICES_MAX_LENGTH,
        choices=STATUS_CHOICES,
    )

    delivery_address = models.CharField(
        max_length=DELIVERY_ADDRESS_MAX_LENGTH,
    )

    def __str__(self):
        return f'OrderID {self.id} from {self.receiver_user}'


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f'{self.listing} : {self.quantity}'


class FeedbackAndRating(models.Model):
    given_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name='given_to')
    given_from = models.ForeignKey(User, on_delete=models.CASCADE, related_name='given_from')
    related_order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='related_order')
    rating = models.PositiveIntegerField(
        default=1,
        choices=[(i, i) for i in range(1, 6)],
        validators=[MaxValueValidator(5)],
        blank=True,
        null=True
    )
    comment = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.given_from.username
