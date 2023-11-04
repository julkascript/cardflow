from django.db import models

from yugiohcardinset.models import YugiohCardInSet


class YugiohCardSet(models.Model):
    card_set_name = models.CharField(
        max_length=100,
        unique=True,
    )

    rarity_code = models.CharField(
        max_length=100,
        unique=True,
    )

    def __str__(self):
        return f'{self.card_set_name} - {self.rarity_code}'
