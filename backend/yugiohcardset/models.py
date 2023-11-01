from django.db import models

from yugiohcardinset.models import YugiohCardInSet


class YugiohCardSet(models.Model):
    card_set_name = models.CharField(
        max_length=100,
        unique=True,
    )

    card_in_set = models.ForeignKey(
        YugiohCardInSet,
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return self.card_set_name
