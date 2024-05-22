# Generated by Django 4.2.6 on 2024-04-17 19:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('order', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='status',
            field=models.CharField(choices=[('ordered', 'Ordered'), ('sent', 'Sent'), ('completed', 'Completed'), ('rejected', 'Rejected')], max_length=9),
        ),
    ]
