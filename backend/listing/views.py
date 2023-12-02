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
    Viewset for API endpoint that implements CRUD operations for listing(cards for sale).
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


@extend_schema(tags=['Listing search'])
class ListingSearchViewSet(viewsets.ModelViewSet):
    """
    Viewset for API endpoint that implements search operations (by 'is_listed') for listing(cards for sale).
    """

    queryset = Listing.objects.all().order_by('id')
    serializer_class = ListingSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_class = ListingFilter
    http_method_names = ['get']

    def get_queryset(self):

        if self.request.query_params.get('is_listed') == 'true':
            return self.queryset.filter(is_listed=True)
        elif self.request.query_params.get('is_listed') == 'false':
            return self.queryset.filter(is_listed=False)
        else:
            return self.queryset
