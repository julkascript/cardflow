from django.contrib.auth import get_user_model
from django.core.validators import MaxValueValidator
from django.db import models
from django.utils import timezone

from listing.models import Listing

User = get_user_model()


class Order(models.Model):
    STATUS_CHOICES = [
        ('ordered', 'Ordered'),
        ('sent', 'Sent'),
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

    def save(self, *args, **kwargs):
        is_new_order = not self.pk
        old_order = None

        if not is_new_order:
            old_order = Order.objects.get(pk=self.pk)

        super().save(*args, **kwargs)

        if is_new_order or (self.pk and old_order.status != self.status):
            OrderStatusHistory.objects.create(order=self, status=self.status)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f'{self.listing} : {self.quantity}'


class OrderStatusHistory(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='status_history')
    status = models.CharField(max_length=10)
    timestamp = models.DateTimeField(auto_now=True, auto_now_add=False)

    def __str__(self):
        return f'Order {self.order.id} - Status: {self.status}'

    class Meta:
        ordering = ['-timestamp']


class FeedbackAndRating(models.Model):
    receiver_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='receiveruser')
    sender_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='senderuser')
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
        return self.sender_user.username
