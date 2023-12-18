from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets
from rest_framework import permissions

from .filters import ListingFilter
from .models import Listing
from .permissions import IsOwner
from .serializers import ListingSerializer


@extend_schema(tags=['Listing'])
class ListingViewSet(viewsets.ModelViewSet):
    """
     Viewset for API endpoint that implements CRUD operations for listing(cards for sale).
    - To perform listing search for all users use base endpoint (api/listing/).
    - To perform listing search by 'is_listed' use base endpoint with ?is_listed=true/false parameter.
    - To perform listing search for specific user use base endpoint with ?user_id=<user_id> parameter.
    - To perform PUT or PATCH use base endpoint with /<listing_id> parameter.
    """

    queryset = Listing.objects.all().order_by('id')
    serializer_class = ListingSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = ListingFilter

    def get_permissions(self):

        if self.request.method in ['GET']:
            return [permissions.AllowAny()]

        return [IsOwner(), permissions.IsAuthenticated()]

    def get_queryset(self):

        user = self.request.query_params.get('user_id', None)

        if user:
            if [IsOwner()]:
                return self.queryset.filter(user=user)

        return self.queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
