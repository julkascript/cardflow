# Generated by Django 4.2.6 on 2025-01-26 06:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('order', '0004_alter_orderstatushistory_options'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='names',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='order',
            name='phone_number',
            field=models.CharField(blank=True, max_length=30, null=True),
        ),
    ]
