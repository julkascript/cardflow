from django.db import models


class YugiohCardInSet(models.Model):
    rarity = models.ForeignKey(
        'yugiohcardrarity.YugiohCardRarity',
        on_delete=models.CASCADE,
    )
    set = models.ForeignKey(
        'yugiohcardset.YugiohCardSet',
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return f'{self.set} - {self.rarity}'
