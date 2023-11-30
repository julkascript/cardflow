from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets
from rest_framework import permissions

from .filters import ListingFilter
from .models import Listing
from .serializers import ListingSerializer


@extend_schema(tags=['Listing'])
class ListingViewSet(viewsets.ModelViewSet):
    """
    Viewset for API endpoint that shows listing(cards for sale).
    """

    queryset = Listing.objects.all().order_by('id')
    serializer_class = ListingSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = ListingFilter

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
