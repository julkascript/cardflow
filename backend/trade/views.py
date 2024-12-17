from datetime import datetime

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
from listing.models import Listing


@extend_schema(tags=['Trade'])
class TradeListingViewSet(viewsets.ModelViewSet):
    model = Trade
    queryset = Trade.objects.all()
    serializer_class = TradeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Trade.objects.filter(
            models.Q(initiator=user) | models.Q(recipient=user)
        ).select_related('initiator', 'recipient')

    def perform_create(self, serializer):
        serializer.save(initiator=self.request.user, trade_status=Trade.NEGOTIATE)

    @action(detail=True, methods=['patch'])
    def negotiate(self, request, pk=None):
        """
        Handles negotiation:
        - Automatically updates the negotiator's decision if listings or cash have changed.
        - Resets the other participant's decision to "pending."
        """
        trade = get_object_or_404(Trade, pk=pk)

        if trade.trade_status in [Trade.ACCEPTED, Trade.REJECTED]:
            return Response({'detail': 'Cannot negotiate after trade is finalized.'},
                            status=status.HTTP_400_BAD_REQUEST)

        if request.user not in [trade.initiator, trade.recipient]:
            return Response({'detail': 'You do not have permission to negotiate this trade.'},
                            status=status.HTTP_403_FORBIDDEN)

        # Check if user modifies cash or listings
        data = request.data

        if 'initiator_listing' in data or 'recipient_listing' in data or 'initiator_cash' in data or 'recipient_cash' in data:
            if request.user == trade.initiator:
                trade.initiator_decision = 'accept'
                trade.recipient_decision = 'pending'
            else:
                trade.recipient_decision = 'accept'
                trade.initiator_decision = 'pending'

            trade.trade_status = Trade.NEGOTIATE

        serializer = self.get_serializer(trade, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            trade.update_trade_status()

            changed_data = ""
            if 'initiator_listing' in data:
                proposed_listing = get_object_or_404(Listing, pk=data['initiator_listing'][0])
                changed_data += f"Initiator's listing: {proposed_listing}"
            if 'recipient_listing' in data:
                proposed_listing = get_object_or_404(Listing, pk=data['recipient_listing'][0])
                changed_data += f"Recipient's listing: {proposed_listing}"
            if 'initiator_cash' in data:
                changed_data += f"Initiator's cash: {data['initiator_cash']}"
            if 'recipient_cash' in data:
                changed_data += f"Recipient's cash: {data['recipient_cash']}"

            system_chat = get_object_or_404(TradeChat, trade_id=trade.id)
            ChatMessage.objects.create(
                trade_chat=system_chat,
                sender_type=ChatMessage.SYSTEM,
                event_type=trade.trade_status,
                message=f"{trade.initiator if request.user == trade.initiator else trade.recipient} "
                        f"negotiates with: {changed_data}.",
            )

            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['patch'])
    def accept(self, request, pk=None):
        """
        Manually accepts a trade.
        """
        trade = get_object_or_404(Trade, pk=pk)

        if trade.trade_status in [Trade.ACCEPTED, Trade.REJECTED]:
            return Response({'detail': 'Cannot accept after trade is finalized.'},
                            status=status.HTTP_400_BAD_REQUEST)

        if request.user == trade.initiator:
            trade.initiator_decision = 'accept'
        elif request.user == trade.recipient:
            trade.recipient_decision = 'accept'

        trade.update_trade_status()
        trade.save()

        system_chat = get_object_or_404(TradeChat, trade_id=trade.id)
        initiator_listing = ', '.join([str(l) for l in trade.initiator_listing.all()]) if request.user == trade.initiator else ', '.join([str(l) for l in trade.recipient_listing.all()])
        recipient_listing = ', '.join([str(l) for l in trade.initiator_listing.all()]) if request.user == trade.recipient else ', '.join([str(l) for l in trade.recipient_listing.all()])
        ChatMessage.objects.create(
            trade_chat=system_chat,
            sender_type=ChatMessage.SYSTEM,
            event_type=trade.trade_status,
            message=f"{trade.initiator if request.user == trade.initiator else trade.recipient} "
                    f"accepted the trade offer {initiator_listing} "
                    f"in exchange for {recipient_listing}.",
        )

        if trade.trade_status == Trade.ACCEPTED:
            ChatMessage.objects.create(
                trade_chat=system_chat,
                sender_type=ChatMessage.SYSTEM,
                event_type=trade.trade_status,
                message=f"Trade agreement reached: \n"
                        f"{initiator_listing} in exchange for {recipient_listing}. \n\n"
                        f"Please align on the physical trade between yourselves. Feel free to use this chat.",
            )

        return Response({'status': trade.trade_status}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['patch'])
    def reject(self, request, pk=None):
        """
        Manually rejects a trade.
        """
        trade = get_object_or_404(Trade, pk=pk)

        if trade.trade_status in [Trade.ACCEPTED, Trade.REJECTED]:
            return Response({'detail': 'Cannot reject after trade is finalized.'},
                            status=status.HTTP_400_BAD_REQUEST)

        if request.user == trade.initiator:
            trade.initiator_decision = 'reject'
        elif request.user == trade.recipient:
            trade.recipient_decision = 'reject'

        trade.update_trade_status()
        trade.save()

        system_chat = get_object_or_404(TradeChat, trade_id=trade.id)
        ChatMessage.objects.create(
            trade_chat=system_chat,
            sender_type=ChatMessage.SYSTEM,
            event_type=trade.trade_status,
            message=f"{trade.initiator if request.user == trade.initiator else trade.recipient} "
                    f"rejected the trade. Trade is now finished with status {trade.trade_status}.",
        )

        return Response({'status': trade.trade_status}, status=status.HTTP_200_OK)


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

        if user not in trade_chat.participants.all():
            return Response(status=status.HTTP_403_FORBIDDEN,
                            data={'detail': 'You do not have permission to view this chat.'})

        serializer = TradeChatSerializer(trade_chat)
        return Response(serializer.data)

    def post(self, request, trade_id):
        """Send a message (user or system) in the trade chat."""

        trade_chat, created = TradeChat.objects.get_or_create(trade_id=trade_id)

        # Get the related trade object to determine the current trade status and get the participants
        trade = get_object_or_404(Trade, id=trade_id)

        if request.user != trade.initiator and request.user != trade.recipient:
            return Response(status=status.HTTP_403_FORBIDDEN,
                            data={'detail': 'You do not have permission to create messages in this chat.'})

        if created:
            trade_chat.participants.add(trade.initiator, trade.recipient)

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
