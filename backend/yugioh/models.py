from django.db import models

from card.models import Card


class YugiohCard(models.Model):
    type = models.CharField(
        max_length=100,
    )

    frame_type = models.CharField(
        max_length=100,
    )

    description = models.CharField(
        max_length=1000,
        blank=True,
        null=True,
    )

    attack = models.CharField(
        max_length=100,
        blank=True,
        null=True,
    )

    defense = models.CharField(
        max_length=100,
        blank=True,
        null=True,
    )

    level = models.CharField(
        max_length=100,
        blank=True,
        null=True,
    )

    race = models.CharField(
        max_length=100,
    )

    attribute = models.CharField(
        max_length=100,
        blank=True,
        null=True,
    )

    archetype = models.CharField(
        max_length=100,
        blank=True,
        null=True,
    )

    image = models.URLField(
        blank=True,
        null=True,
    )

    card = models.ForeignKey(
        Card,
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return self.card.card_name


class YugiohCardInSet(models.Model):
    rarity = models.ForeignKey(
        'YugiohCardRarity',
        on_delete=models.CASCADE,
    )
    set = models.ForeignKey(
        'YugiohCardSet',
        on_delete=models.CASCADE,
    )

    yugioh_card = models.ForeignKey(
        YugiohCard,
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return f'{self.yugioh_card.card.card_name} - {self.set} - {self.rarity}'


class YugiohCardSet(models.Model):
    card_set_name = models.CharField(
        max_length=100,
        unique=True,
    )

    set_code = models.CharField(
        max_length=100,
        unique=True,
    )

    def __str__(self):
        return f'{self.card_set_name} - {self.set_code}'


class YugiohCardRarity(models.Model):
    rarity = models.CharField(
        max_length=100,
        unique=True,
    )

    rarity_code = models.CharField(
        max_length=100,
        unique=True,
    )

    class Meta:
        verbose_name_plural = 'Yugioh Card Rarities'
        verbose_name = 'Yugioh Card Rarity'

    def __str__(self):
        return f'{self.rarity} - {self.rarity_code}'
