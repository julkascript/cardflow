from django.db import models


class YugiohCardRarity(models.Model):
    rarity = models.CharField(
        max_length=100,
        unique=True,
    )

    class Meta:
        verbose_name_plural = 'Yugioh Card Rarities'
        verbose_name = 'Yugioh Card Rarity'

    def __str__(self):
        return {self.rarity}
