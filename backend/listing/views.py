import json

from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from rest_framework import permissions
from rest_framework import viewsets, status
from rest_framework.response import Response

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

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        request_is_sold = self.request.data.get('is_sold', False)

        if instance.is_sold:
            instance.is_listed = False
            instance.save()
            return Response({"detail": "Listing is already sold."}, status=status.HTTP_400_BAD_REQUEST)

        if bool(request_is_sold):
            if not instance.is_listed:
                return Response({"detail": "Unlisted items cannot be sold."}, status=status.HTTP_400_BAD_REQUEST)

            # Mark the listing as sold
            instance.is_sold = True
            instance.is_listed = False
            if self.request.data.get('is_listed'):
                self.request.data['is_listed'] = False
            instance.save()


        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    def list(self, request, *args, **kwargs):
        is_sold = self.request.query_params.get('is_sold', None)

        if is_sold is not None:
            is_sold = json.loads(is_sold.lower())
            # Filter listings based on is_sold parameter
            queryset = Listing.objects.filter(is_sold=is_sold, user=self.request.user)
        else:
            # Return all listings if is_sold parameter is not provided
            queryset = Listing.objects.filter(user=self.request.user)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


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
