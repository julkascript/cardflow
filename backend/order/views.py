from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from order.filters import OrderFilter
from order.models import Order
from order.serializer import OrderSerializer


@extend_schema(tags=['Order'])
class OrderViewSet(viewsets.ReadOnlyModelViewSet, viewsets.mixins.UpdateModelMixin):
    """
    Viewset for API endpoint that allows to see the orders.

    - To view all Orders use the base endpoint (api/order/).
    - To view specific order use the endpoint (api/order/<id>/)

    - For pagination, use the following format: (/api/order/?page=2)
    """

    queryset = Order.objects.all().order_by('id')
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]

    filterset_class = OrderFilter
