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
        return Trade.objects.filter(initiator=user) | Trade.objects.filter(recipient=user)

    def perform_create(self, serializer):
        serializer.save(initiator=self.request.user, trade_status=Trade.INITIATION)

    @action(detail=True, methods=['post'])
    def negotiate(self, request, pk=None):
        trade = get_object_or_404(Trade, pk=pk)
        if request.user != trade.initiator and request.user != trade.recipient:
            return Response({'detail': 'You do not have permission to negotiate this trade.'},
                            status=status.HTTP_403_FORBIDDEN)

        if request.user == trade.initiator:
            trade.initiator_decision = request.data.get('initiator_decision', trade.initiator_decision)
        elif request.user == trade.recipient:
            trade.recipient_decision = request.data.get('recipient_decision', trade.recipient_decision)

        trade.update_trade_status()
        trade.save()
        return Response({'status': 'negotiation started'})

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        trade = get_object_or_404(Trade, pk=pk)
        if request.user == trade.initiator:
            trade.initiator_decision = 'accepted'
        elif request.user == trade.recipient:
            trade.recipient_decision = 'accepted'
        trade.update_trade_status()
        trade.save()
        return Response({'status': trade.trade_status})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        trade = get_object_or_404(Trade, pk=pk)
        if request.user == trade.initiator:
            trade.initiator_decision = 'rejected'
        elif request.user == trade.recipient:
            trade.recipient_decision = 'rejected'
        trade.update_trade_status()
        trade.save()
        return Response({'status': trade.trade_status})

    @action(detail=True, methods=['post'])
    def counter_offer(self, request, pk=None):
        trade = get_object_or_404(Trade, pk=pk)
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

