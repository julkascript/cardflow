from django.db import models

from yugiohcardinset.models import YugiohCardInSet


class YugiohCardRarity(models.Model):
    rarity = models.CharField(
        max_length=100,
        unique=True,
    )

    set = models.ForeignKey(
        YugiohCardInSet,
        on_delete=models.CASCADE,
    )

    class Meta:
        ordering = ('set', 'rarity')
        verbose_name_plural = 'Yugioh Card Rarities'
        verbose_name = 'Yugioh Card Rarity'

    def __str__(self):
        return f'{self.set} - {self.rarity}'
