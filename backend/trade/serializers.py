from rest_framework import serializers

from .models import Trade, ChatMessage, TradeChat
from listing.models import Listing

from accounts.serializers import UserTradeParticipant
from django.contrib.auth import get_user_model

User = get_user_model()


class TradeSerializer(serializers.ModelSerializer):
    initiator = UserTradeParticipant(read_only=True)
    recipient = UserTradeParticipant(read_only=True)
    initiator_listing = serializers.PrimaryKeyRelatedField(many=True, queryset=Listing.objects.all())
    recipient_listing = serializers.PrimaryKeyRelatedField(many=True, queryset=Listing.objects.all())
    recipient_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='recipient', write_only=True)
    initiator_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='initiator', write_only=True)

    class Meta:
        model = Trade
        fields = [
            'id',
            'initiator',
            'recipient',
            'initiator_listing',
            'recipient_listing',
            'initiator_cash',
            'recipient_cash',
            'trade_status',
            'initiator_decision',
            'recipient_decision',
            'recipient_id',
            'initiator_id'
        ]
        read_only_fields = ['id', 'trade_status', 'initiator', 'recipient']

    def create(self, validated_data):
        initiator_listing = validated_data.pop('initiator_listing')
        recipient_listing = validated_data.pop('recipient_listing')
        initiator = validated_data.pop('initiator')

        recipient = validated_data.pop('recipient')

        if initiator == recipient:
            raise serializers.ValidationError("Cannot trade with yourself.")

        trade = Trade.objects.create(
            initiator=initiator,
            recipient=recipient,
            **validated_data
        )

        trade.initiator_listing.set(initiator_listing)
        trade.recipient_listing.set(recipient_listing)
        trade.initiator_decision = 'accept'

        trade.save()

        return trade

    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)
        user = self.context['request'].user

        if user == instance.initiator:
            if 'recipient_decision' in validated_data:
                raise serializers.ValidationError("Initiator cannot change recipient's decision.")

        if user == instance.recipient:
            if 'initiator_decision' in validated_data:
                raise serializers.ValidationError("Recipient cannot change initiator's decision.")

        if instance.trade_status in [Trade.ACCEPTED]:
            raise serializers.ValidationError("Cannot change decisions after trade is accepted.")

        if instance.trade_status in [Trade.REJECTED]:
            raise serializers.ValidationError("Cannot change decisions after trade is rejected.")

        if user == instance.initiator:
            instance.initiator_decision = validated_data.get('initiator_decision', instance.initiator_decision)
        elif user == instance.recipient:
            instance.recipient_decision = validated_data.get('recipient_decision', instance.recipient_decision)

        instance.initiator_cash = validated_data.get('initiator_cash', instance.initiator_cash)
        instance.recipient_cash = validated_data.get('recipient_cash', instance.recipient_cash)

        instance.update_trade_status()
        instance.save()
        return instance

    def validate_initiator_listing(self, value):
        initiator_id = self.initial_data.get('initiator_id')

        if not initiator_id:
            raise serializers.ValidationError("Initiator ID is required.")

        for listing in value:
            if listing.user_id != initiator_id or not listing.is_listed:
                raise serializers.ValidationError(
                    f"You can not trade with initiator's listing ids: {[listing.id for listing in value]}.")
        return value

    def validate_recipient_listing(self, value):
        recipient_id = self.initial_data.get('recipient_id')

        if not recipient_id:
            raise serializers.ValidationError("Recipient ID is required.")

        recipient = User.objects.get(id=recipient_id)

        for listing in value:
            if listing.user != recipient or not listing.is_listed:
                raise serializers.ValidationError(
                    f"You can not trade with recipient's listing ids: {[listing.id for listing in value]}.")
        return value

    def validate(self, data):
        user = self.context['request'].user

        if self.instance:
            if 'initiator_decision' in data and user != self.instance.initiator:
                raise serializers.ValidationError("Recipient cannot change initiator's decision.")

            if 'recipient_decision' in data and user != self.instance.recipient:
                raise serializers.ValidationError("Initiator cannot change recipient's decision.")

        return data


class ChatMessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)

    class Meta:
        model = ChatMessage
        fields = ['id', 'sender_type', 'sender', 'sender_username', 'message', 'event_type', 'created_at']
        extra_kwargs = {
            'sender': {'required': False},  # sender can be optional for system messages
            'sender_type': {'required': False},
        }

    def create(self, validated_data):
        # Retrieve the trade_chat from the context passed in the view
        trade_chat = self.context['trade_chat']

        # Dynamically assign the sender_type based on whether a sender (user) is provided
        if 'sender' in validated_data and validated_data['sender'] is not None:
            validated_data['sender_type'] = ChatMessage.USER
        else:
            validated_data['sender_type'] = ChatMessage.SYSTEM

        # Create the message with the trade_chat assigned
        return ChatMessage.objects.create(trade_chat=trade_chat, **validated_data)

class TradeChatSerializer(serializers.ModelSerializer):
    messages = ChatMessageSerializer(many=True, read_only=True)

    class Meta:
        model = TradeChat
        fields = ['id', 'trade_id', 'created_at', 'messages']