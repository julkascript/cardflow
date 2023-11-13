from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets
from rest_framework import permissions

from .models import YugiohCard
from .serializers import YugiohSerializer
from .filters import YugiohFilter


@extend_schema(tags=['Yu-Gi-Oh Card'])
class YugiohViewSet(viewsets.ModelViewSet):
    """
    Viewset for API endpoint that shows card list, allows Yugioh cards to be viewed by ID.
    Also allows filtering by name, set or both.
    """

    queryset = YugiohCard.objects.all().order_by('card_name')
    serializer_class = YugiohSerializer
    permission_classes = [permissions.AllowAny]
    http_method_names = ['get']
