from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets
from rest_framework import permissions

from .models import YugiohCard, YugiohCardInSet
from .serializers import YugiohCardInSetSerializer, YugiohCardSerializer
from .filters import YugiohCardFilter, YugiohCardInSetFilter


@extend_schema(tags=['Yu-Gi-Oh Card'])
class YugiohCardViewSet(viewsets.ModelViewSet):
    """
    Viewset for API endpoint that shows card list, allows Yugioh cards to be viewed by ID.
    Also allows filtering by card name.
    """

    queryset = YugiohCard.objects.all().order_by('card_name')
    serializer_class = YugiohCardSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_class = YugiohCardFilter
    http_method_names = ['get']


@extend_schema(tags=['Yu-Gi-Oh Card in set'])
class YugiohCardInSetViewSet(viewsets.ModelViewSet):
    """
    Viewset for API endpoint that shows card in set list.
    Also allows filtering by card in set ID.
    """

    queryset = YugiohCardInSet.objects.all().order_by('yugioh_card__card_name')
    serializer_class = YugiohCardInSetSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_class = YugiohCardInSetFilter
    http_method_names = ['get']

