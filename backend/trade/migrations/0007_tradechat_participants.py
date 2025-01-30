# Generated by Django 4.2.6 on 2024-10-24 09:16

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('trade', '0006_tradechat_chatmessage'),
    ]

    operations = [
        migrations.AddField(
            model_name='tradechat',
            name='participants',
            field=models.ManyToManyField(to=settings.AUTH_USER_MODEL),
        ),
    ]
