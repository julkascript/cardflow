from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from rest_framework import permissions
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

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

    def get_queryset(self):

        user = self.request.query_params.get('user_id', None)

        if user:
            if [IsOwner()]:
                return self.queryset.filter(user=user)

        return self.queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@extend_schema(tags=['Listing search'])
class ListingSearchViewSet(viewsets.ModelViewSet):
    """
    Viewset for API endpoint that implements search operations (by 'is_listed') for listing(cards for sale).
    """

    queryset = Listing.objects.all()
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


@extend_schema(tags=['Buy Listing'])
class BuyListingViewSet(viewsets.ModelViewSet):
    """
    ViewSet for \n
        - API endpoint that implements buy operation for a listing \n
        - API endpoint that query for sold listings \n
        - API endpoint that query for unsold listings \n
    """

    queryset = Listing.objects.filter()
    serializer_class = ListingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action == 'mark_as_sold':
            return [IsOwner()]
        return super().get_permissions()

    @action(detail=True, methods=['put'])
    def mark_as_sold(self, request, *args, **kwargs):
        listing = self.get_object()

        if listing.is_sold:
            return Response({'detail': 'Listing is already sold.'}, status=status.HTTP_400_BAD_REQUEST)

        if not listing.is_listed:
            return Response({"detail": "Unlisted items cannot be sold."}, status=status.HTTP_400_BAD_REQUEST)

        listing.is_sold = True
        listing.is_listed = False
        listing.save()

        serializer = self.get_serializer(listing)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def unsold_listings(self, request):

        unsold_listings = Listing.objects.filter(is_sold=False, is_listed=True)
        serializer = self.get_serializer(unsold_listings, many=True)

        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def sold_listings(self, request):

        sold_listings = Listing.objects.filter(is_sold=True)
        serializer = self.get_serializer(sold_listings, many=True)

        return Response(serializer.data)
