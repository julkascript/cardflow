from django.db import models
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import Trade
from .serializers import TradeSerializer


@extend_schema(tags=['Trade'])
class TradeListingViewSet(viewsets.ModelViewSet):
    model = Trade
    queryset = Trade.objects.all()
    serializer_class = TradeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Trade.objects.filter(models.Q(initiator=user) | models.Q(recipient=user)
                                    ).select_related('initiator', 'recipient')

    def perform_create(self, serializer):
        serializer.save(initiator=self.request.user, trade_status=Trade.NEGOTIATE)

    @action(detail=True, methods=['post'])
    def negotiate(self, request, pk=None):
        trade = get_object_or_404(Trade, pk=pk)

        if trade.trade_status in [Trade.ACCEPTED, Trade.REJECTED]:
            return Response({'detail': 'Cannot negotiate after trade is accepted or rejected.'},
                            status=status.HTTP_400_BAD_REQUEST)

        if request.user != trade.initiator and request.user != trade.recipient:
            return Response({'detail': 'You do not have permission to negotiate this trade.'},
                            status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(trade, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        trade = get_object_or_404(Trade, pk=pk)

        if trade.trade_status in [Trade.ACCEPTED, Trade.REJECTED]:
            return Response({'detail': 'Cannot accept after trade is accepted or rejected.'},
                            status=status.HTTP_400_BAD_REQUEST)

        if request.user == trade.initiator:
            trade.initiator_decision = 'accept'
        elif request.user == trade.recipient:
            trade.recipient_decision = 'accept'

        trade.update_trade_status()
        trade.save()
        return Response({'status': trade.trade_status})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        trade = get_object_or_404(Trade, pk=pk)

        if trade.trade_status in [Trade.ACCEPTED, Trade.REJECTED]:
            return Response({'detail': 'Cannot reject after trade is accepted or rejected.'},
                            status=status.HTTP_400_BAD_REQUEST)

        if request.user == trade.initiator:
            trade.initiator_decision = 'reject'
        elif request.user == trade.recipient:
            trade.recipient_decision = 'reject'

        trade.update_trade_status()
        trade.save()
        return Response({'status': trade.trade_status})

    @action(detail=True, methods=['post'])
    def counter_offer(self, request, pk=None):
        trade = get_object_or_404(Trade, pk=pk)

        if trade.trade_status in [Trade.ACCEPTED, Trade.REJECTED]:
            return Response({'detail': 'Cannot make a counter offer after trade is accepted or rejected.'},
                            status=status.HTTP_400_BAD_REQUEST)

        if request.user != trade.initiator and request.user != trade.recipient:
            return Response({'detail': 'You do not have permission to make a counter offer for this trade.'},
                            status=status.HTTP_403_FORBIDDEN)

        data = request.data.copy()
        data['initiator'] = trade.recipient.id
        data['recipient'] = trade.initiator.id

        serializer = TradeSerializer(data=data, context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
