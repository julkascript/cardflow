from django.db import models
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from .models import Trade, TradeChat, ChatMessage
from .serializers import TradeSerializer, TradeChatSerializer, ChatMessageSerializer


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


@extend_schema(tags=['Trade chat'])
class TradeChatView(APIView):
    """
        This view allows the user to retrieve all messages for a given trade chat if the user has permission. Also
        allows the user to send a message in the trade chat.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, trade_id):
        """Retrieve all messages for a given trade chat if the user has permission."""

        trade_chat = get_object_or_404(TradeChat, trade_id=trade_id)
        user = request.user

        if user.id not in trade_chat.messages.values_list('sender_id', flat=True):
            return Response(status=status.HTTP_403_FORBIDDEN, data={'detail': 'You do not have permission to view this chat.'})

        serializer = TradeChatSerializer(trade_chat)
        return Response(serializer.data)

    def post(self, request, trade_id):
        """Send a message (user or system) in the trade chat."""

        trade_chat, created = TradeChat.objects.get_or_create(trade_id=trade_id)

        # Get the related trade object to determine the current trade status
        trade = get_object_or_404(Trade, id=trade_id)

        data = request.data.copy()

        # Set the event_type based on the current trade status
        data['event_type'] = trade.trade_status

        # If the user is authenticated, set the sender to the current user
        if request.user.is_authenticated:
            data['sender'] = request.user.id
        else:
            data['sender'] = None

        serializer = ChatMessageSerializer(data=data, context={'trade_chat': trade_chat})

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
