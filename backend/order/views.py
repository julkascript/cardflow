from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, permissions

from order.filters import OrderFilter
from order.models import Order
from order.serializer import OrderSerializer


@extend_schema(tags=['Order'])
class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    """

    """

    queryset = Order.objects.all().order_by('id')
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]

    filterset_class = OrderFilter



