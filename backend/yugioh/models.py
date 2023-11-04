from django.db import models


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
        'card.Card',
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return self.yugioh_card_name
