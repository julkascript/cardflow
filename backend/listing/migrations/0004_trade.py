# Generated by Django 4.2.6 on 2024-07-29 07:43

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('listing', '0003_rename_is_tradable_listing_is_trade_considered'),
    ]

    operations = [
        migrations.CreateModel(
            name='Trade',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('initiator_cash', models.FloatField(default=0.0)),
                ('recipient_cash', models.FloatField(default=0.0)),
                ('status', models.CharField(choices=[('awaiting_their_response', 'Awaiting their response'), ('awaiting_your_response', 'Awaiting your response'), ('deal_reached', 'Deal reached'), ('rejected', 'Rejected')], default='awaiting_their_response', max_length=23)),
                ('initiator_decision', models.CharField(choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected')], default='pending', max_length=8)),
                ('recipient_decision', models.CharField(choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected')], default='pending', max_length=8)),
                ('initiator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='initiated_trades', to=settings.AUTH_USER_MODEL)),
                ('initiator_listings', models.ManyToManyField(related_name='initiated_trades', to='listing.listing')),
                ('recipient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='received_trades', to=settings.AUTH_USER_MODEL)),
                ('recipient_listings', models.ManyToManyField(related_name='received_trades', to='listing.listing')),
            ],
        ),
    ]