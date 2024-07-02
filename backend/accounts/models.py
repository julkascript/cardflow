from django.contrib.auth.models import AbstractUser
from django.db import models


def user_directory_avatars_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/avatars/user_<username>/<filename>
    return 'avatars/user_{0}/{1}'.format(instance.username, filename)


class User(AbstractUser):
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    shipping_address = models.TextField(blank=True, null=True)
    avatar = models.ImageField(upload_to=user_directory_avatars_path, blank=True, null=True)
    currency_preference = models.CharField(
        max_length=3,
        choices=[('BGN', 'BGN'), ('EUR', 'EUR')],
        default='BGN'
    )
