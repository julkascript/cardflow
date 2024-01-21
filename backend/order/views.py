from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, permissions


from order.models import Order
from order.serializer import OrderSerializer


# @extend_schema(tags=['Order'])
# class OrderViewSet(viewsets.ModelViewSet):
#     """
#
#     """
#
#     queryset = Order.objects.all().order_by('id')
#     serializer_class = OrderSerializer
#     permission_classes = [permissions.IsAuthenticated]
#     filter_backends = [DjangoFilterBackend]
#
#     # filterset_class =
#
#     def perform_create(self, serializer):
#         serializer.save(receiver_user=self.request.user)
#
