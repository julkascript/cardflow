from django.db import models


class Game(models.Model):
    game_name = models.CharField(
        max_length=200,
        unique=True,
    )

    def __str__(self):
        return self.game_name
