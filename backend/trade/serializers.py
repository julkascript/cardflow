from rest_framework import serializers

from .models import Trade
from listing.models import Listing


class TradeSerializer(serializers.ModelSerializer):
    initiator_listing = serializers.PrimaryKeyRelatedField(many=True, queryset=Listing.objects.all())
    recipient_listing = serializers.PrimaryKeyRelatedField(many=True, queryset=Listing.objects.all())

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
        ]
        read_only_fields = ['id', 'trade_status', 'initiator', 'recipient']

    def create(self, validated_data):
        initiator_listing = validated_data.pop('initiator_listing')
        recipient_listing = validated_data.pop('recipient_listing')
        initiator = validated_data.pop('initiator')

        recipient = recipient_listing[0].user

        if initiator == recipient:
            raise serializers.ValidationError("Cannot trade with yourself.")

        trade = Trade.objects.create(
            initiator=initiator,
            recipient=recipient,
            **validated_data
        )

        trade.initiator_listing.set(initiator_listing)
        trade.recipient_listing.set(recipient_listing)

        trade.save()

        return trade

    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)

        if instance.trade_status in [Trade.ACCEPTED]:
            raise serializers.ValidationError("Cannot change decisions after trade is accepted.")

        if instance.trade_status in [Trade.REJECTED]:
            raise serializers.ValidationError("Cannot change decisions after trade is rejected.")

        instance.update_trade_status()
        instance.save()
        return instance

    def validate(self, data):
        user = self.context['request'].user

        if self.instance:
            if 'initiator_decision' in data and user != self.instance.initiator:
                raise serializers.ValidationError("Recipient cannot change initiator's decision.")

            if 'recipient_decision' in data and user != self.instance.recipient:
                raise serializers.ValidationError("Initiator cannot change recipient's decision.")

        return data
