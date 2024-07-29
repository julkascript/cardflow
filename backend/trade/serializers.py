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
        read_only_fields = ['trade_status', 'initiator', 'recipient', 'recipient_decision']

    def create(self, validated_data):
        print('validated_data', validated_data)

        initiator_listing = validated_data.pop('initiator_listing')
        recipient_listing = validated_data.pop('recipient_listing')
        initiator = validated_data.pop('initiator')
        print(initiator)

        recipient = recipient_listing[0].user
        print(recipient)

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

        if instance.initiator_decision == 'accepted' and instance.recipient_decision == 'accepted':
            instance.trade_status = 'accept'
        elif instance.initiator_decision == 'rejected' or instance.recipient_decision == 'reject':
            instance.trade_status = 'rejected'
        else:
            instance.trade_status = 'negotiate'

        if instance.recipient == self.context['request'].user:
            instance.recipient_decision = validated_data.get('initiator_decision')

        instance.update_decisions()
        instance.update_trade_status()

        instance.save()
        return instance
