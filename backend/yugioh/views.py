from django.db.models import Count, Subquery, OuterRef, Min, Sum
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, generics
from rest_framework import permissions

from .models import YugiohCard, YugiohCardInSet
from .serializers import (
    YugiohCardInSetSerializer,
    YugiohCardSerializer,
    BestSellerCardSerializer,
)
from .filters import YugiohCardFilter, YugiohCardInSetFilter
from listing.models import Listing
from order.models import OrderItem


@extend_schema(tags=["Yu-Gi-Oh Card"])
class YugiohCardViewSet(viewsets.ModelViewSet):
    """
    Viewset for API endpoint that shows card list, allows Yugioh cards to be viewed by ID.
    Also allows filtering by card name.
    """

    queryset = YugiohCard.objects.all().order_by("card_name")
    serializer_class = YugiohCardSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_class = YugiohCardFilter
    http_method_names = ["get"]


@extend_schema(tags=["Yu-Gi-Oh Card in set"])
class YugiohCardInSetViewSet(viewsets.ModelViewSet):
    """
    Viewset for API endpoint that shows card in set list.
    Also allows filtering by card in set ID.
    """

    queryset = YugiohCardInSet.objects.all().order_by("yugioh_card__card_name")
    serializer_class = YugiohCardInSetSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_class = YugiohCardInSetFilter
    http_method_names = ["get"]


@extend_schema(tags=["Best Seller Cards"])
class BestSellerCardListView(generics.ListAPIView):
    """
    Viewset for API endpoint that shows 3 bestseller cards for all times.\n
    The bestseller card is defined as the card that has been ordered the most.\n
        - The endpoint is /api/bestseller/
    """

    serializer_class = BestSellerCardSerializer
    authentication_classes = []
    permission_classes = []
    pagination_class = None

    def get_queryset(self):
        top_cards = (
            OrderItem.objects.filter(order__status="completed")
            .values("listing__card")
            .annotate(order_count=Sum("quantity"))
            .order_by("-order_count")
        )

        top_cards_ids = [card["listing__card"] for card in top_cards]

        queryset = (
            Listing.objects.filter(card__in=top_cards_ids)
            .annotate(
                order_count=Subquery(
                    OrderItem.objects.filter(
                        order__status="completed", listing__card=OuterRef("card")
                    )
                    .values("listing__card")
                    .annotate(count=Sum("quantity"))
                    .values("count")
                ),
                lowest_price=Min("price"),
            )
            .order_by("-order_count")[:3]
        )

        return queryset
