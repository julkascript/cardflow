from django.db import models


class YugiohCardInSet(models.Model):
    rarity = models.ForeignKey(
        'yugiohcardrarity.YugiohCardRarity',
        on_delete=models.CASCADE,
    )
    set = models.CharField(max_length=100)

    def __str__(self):
        return f'{self.set} - {self.rarity}'
