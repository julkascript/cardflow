# Generated by Django 4.2.6 on 2023-11-04 13:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('yugiohcardset', '0002_remove_yugiohcardset_card_in_set'),
    ]

    operations = [
        migrations.AddField(
            model_name='yugiohcardset',
            name='rarity_code',
            field=models.CharField(default=1, max_length=100, unique=True),
            preserve_default=False,
        ),
    ]
