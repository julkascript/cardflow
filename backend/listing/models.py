from django.contrib.auth import get_user_model
from django.core import validators
from django.db import models

from yugioh.models import YugiohCardInSet

User = get_user_model()


class Listing(models.Model):
    CONDITION_CHOICES = [
        ('poor', 'Poor'),
        ('played', 'Played'),
        ('good', 'Good'),
        ('excellent', 'Excellent'),
        ('near_mint', 'Near Mint'),
        ('mint', 'Mint'),
    ]
    CONDITION_LENGTH = max(len(c[0]) for c in CONDITION_CHOICES)

    card = models.ForeignKey(
        YugiohCardInSet,
        on_delete=models.CASCADE,
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )

    price = models.FloatField()

    condition = models.CharField(
        max_length=CONDITION_LENGTH,
        choices=CONDITION_CHOICES,
    )

    quantity = models.IntegerField(
        default=1,
        validators=[
            validators.MinValueValidator(1),
            validators.MaxValueValidator(9999),
        ]
    )

    is_listed = models.BooleanField(
        default=True
    )

    is_sold = models.BooleanField(
        default=False
    )

    def __str__(self):
        return f'{self.card.yugioh_card.card_name}'
