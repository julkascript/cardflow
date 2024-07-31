from django.contrib.auth import get_user_model
from django.db import models

from listing.models import Listing

User = get_user_model()


class Trade(models.Model):
    STATUS_CHOICES = [
        ('negotiate', 'Negotiate'),
        ('accept', 'Accept'),
        ('reject', 'Reject'),
    ]

    STATUS_CHOICES_MAX_LENGTH = max(len(c[0]) for c in STATUS_CHOICES)

    INITIATION = 'initiation'
    PENDING = 'pending'
    ACCEPTED = 'accepted'
    REJECTED = 'rejected'

    RESULT_CHOICES = [
        (PENDING, 'Pending'),
        (ACCEPTED, 'Accepted'),
        (REJECTED, 'Rejected'),
    ]

    initiator = models.ForeignKey(User, related_name='initiated_trades', on_delete=models.CASCADE)
    recipient = models.ForeignKey(User, related_name='received_trades', on_delete=models.CASCADE)
    initiator_listing = models.ManyToManyField(Listing, related_name='initiated_trades')
    recipient_listing = models.ManyToManyField(Listing, related_name='received_trades')
    initiator_cash = models.FloatField(default=0.0)
    recipient_cash = models.FloatField(default=0.0)
    trade_status = models.CharField(max_length=STATUS_CHOICES_MAX_LENGTH, choices=STATUS_CHOICES, default='negotiate')
    initiator_decision = models.CharField(max_length=20, choices=RESULT_CHOICES, default=PENDING)
    recipient_decision = models.CharField(max_length=20, choices=RESULT_CHOICES, default=PENDING)

    def __str__(self):
        return f'Trade {self.pk} from {self.initiator} to {self.recipient}'

    def update_trade_status(self):
        if self.initiator_decision == self.ACCEPTED and self.recipient_decision == self.ACCEPTED:
            self.trade_status = 'accept'
        elif self.initiator_decision == self.REJECTED or self.recipient_decision == self.REJECTED:
            self.trade_status = 'reject'
        else:
            self.trade_status = 'negotiate'

        self.save()
