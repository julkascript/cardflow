from django_filters import rest_framework as filters

from .models import User


class UserFilter(filters.FilterSet):
    username = filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = User
        fields = ['username']
