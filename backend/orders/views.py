from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, permissions

from orders.models import Order
from orders.serializer import OrderSerializer


@extend_schema(tags=['Order'])
class OrderViewSet(viewsets.ModelViewSet):
    """

    """

    queryset = Order.objects.all().order_by('id')
    serializer_class = OrderSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    # filterset_class = ListingFilter
