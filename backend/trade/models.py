from django.contrib.auth import get_user_model
from django.db import models

from listing.models import Listing

User = get_user_model()


class Trade(models.Model):
    NEGOTIATE = 'negotiate'
    ACCEPTED = 'accepted'
    REJECTED = 'rejected'

    STATUS_CHOICES = [
        (NEGOTIATE, 'Negotiate'),
        (ACCEPTED, 'Accepted'),
        (REJECTED, 'Rejected'),
    ]

    STATUS_CHOICES_MAX_LENGTH = max(len(c[0]) for c in STATUS_CHOICES)

    INITIATION = 'initiation'
    PENDING = 'pending'
    ACCEPT = 'accept'
    REJECT = 'reject'

    RESULT_CHOICES = [
        (PENDING, 'Pending'),
        (ACCEPT, 'Accept'),
        (REJECT, 'Reject'),
    ]

    RESULT_CHOICES_MAX_LENGTH = max(len(c[0]) for c in RESULT_CHOICES)

    initiator = models.ForeignKey(User, related_name='initiated_trades', on_delete=models.CASCADE)
    recipient = models.ForeignKey(User, related_name='received_trades', on_delete=models.CASCADE)
    initiator_listing = models.ManyToManyField(Listing, related_name='initiated_trades')
    recipient_listing = models.ManyToManyField(Listing, related_name='received_trades')
    initiator_cash = models.FloatField(default=0.0)
    recipient_cash = models.FloatField(default=0.0)
    trade_status = models.CharField(max_length=STATUS_CHOICES_MAX_LENGTH, choices=STATUS_CHOICES, default=NEGOTIATE)
    initiator_decision = models.CharField(max_length=RESULT_CHOICES_MAX_LENGTH, choices=RESULT_CHOICES, default=PENDING)
    recipient_decision = models.CharField(max_length=RESULT_CHOICES_MAX_LENGTH, choices=RESULT_CHOICES, default=PENDING)

    def __str__(self):
        return f'Trade {self.pk} from {self.initiator} to {self.recipient}'

    def update_trade_status(self):
        if self.initiator_decision == self.ACCEPT and self.recipient_decision == self.ACCEPT:
            self.trade_status = self.ACCEPTED
        elif self.initiator_decision == self.REJECT or self.recipient_decision == self.REJECT:
            self.trade_status = self.REJECTED
        else:
            self.trade_status = self.NEGOTIATE

        self.save()
