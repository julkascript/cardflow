from django.contrib.auth import get_user_model
from django.db import models

from game.models import Game

User = get_user_model()


class Card(models.Model):
    card_name = models.CharField(
        max_length=200,
        unique=True,
    )

    game = models.ForeignKey(
        Game,
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return self.card_name
