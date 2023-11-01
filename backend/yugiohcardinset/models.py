from django.db import models


class YugiohCardInSet(models.Model):
    rarity = models.CharField(max_length=100)
    set = models.CharField(max_length=100)

    def __str__(self):
        return f'{self.set} - {self.rarity}'
