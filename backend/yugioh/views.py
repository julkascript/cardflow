from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema, extend_schema_field, extend_schema_view, OpenApiParameter
from rest_framework import viewsets
from rest_framework import permissions

from yugioh.models import YugiohCard
from yugioh.serializers import YugiohSerializer
from yugioh.filters import YugiohFilter


@extend_schema(tags=['Yu-Gi-Oh Card'])
class YugiohViewSet(viewsets.ModelViewSet):
    """
    Viewset for API endpoint that shows card list, allows Yugioh cards to be viewed by ID.
    Also allows filtering by name, set or both.
    """

    queryset = YugiohCard.objects.all().order_by('id')
    serializer_class = YugiohSerializer
    permission_classes = [permissions.AllowAny]
    http_method_names = ['get']
    filter_backends = [DjangoFilterBackend]
    filterset_class = YugiohFilter

    # def get_queryset(self):
    #     """Filter Yugioh cards by name, set or both"""
    #
    #     name = self.request.query_params.get('name')
    #     card_set = self.request.query_params.get('yugiohcardinset')
    #
    #     if name is not None:
    #         return self.queryset.filter(card_name__icontains=name)
    #
    #     if card_set is not None:
    #         return self.queryset.filter(set__icontains=card_set)
    #
    #     return self.queryset
