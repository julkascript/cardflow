from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets
from rest_framework import permissions

from .models import YugiohCard, YugiohCardInSet
from .serializers import YugiohSerializer, YugiohCardInSetSerializer
from .filters import YugiohFilter


@extend_schema(tags=['Yu-Gi-Oh Card'])
class YugiohViewSet(viewsets.ModelViewSet):
    """
    Viewset for API endpoint that shows card list, allows Yugioh cards to be viewed by ID.
    Also allows filtering by card name, set or both.
    """

    queryset = YugiohCard.objects.all().order_by('card_name')
    serializer_class = YugiohSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_class = YugiohFilter
    http_method_names = ['get']


@extend_schema(tags=['Yu-Gi-Oh Card in set'])
class YugiohCardInSetViewSet(viewsets.ModelViewSet):
    """
    Viewset for API endpoint that shows card in set list, allows Yugioh card in set to be viewed by ID.
    """

    queryset = YugiohCardInSet.objects.all().order_by('rarity', 'set', 'yugioh_card')
    serializer_class = YugiohCardInSetSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    # filterset_class = YugiohFilter
    http_method_names = ['get']
