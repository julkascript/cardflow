# Generated by Django 4.2.6 on 2024-10-24 09:46

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('trade', '0007_tradechat_participants'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tradechat',
            name='participants',
            field=models.ManyToManyField(related_name='trade_chats', to=settings.AUTH_USER_MODEL),
        ),
    ]
