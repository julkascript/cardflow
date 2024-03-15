from datetime import timedelta

from django.core.management.base import BaseCommand
from django.db.models import Max
from django.utils import timezone

from order.models import OrderStatusHistory, Order


class Command(BaseCommand):
    help = 'Marks Sent orders older than 7 days as completed if they are not already completed'

    def handle(self, *args, **options):
        # Define the time threshold for auto-completion (7 days)
        auto_completion_threshold = timezone.now() - timedelta(days=7)

        sent_orders = Order.objects.filter(status='sent').values('id')

        max_timestamp_orders = OrderStatusHistory.objects.filter(order_id__in=sent_orders).values('order_id').annotate(
            max_timestamp=Max('timestamp')).values('order_id', 'max_timestamp').filter(
            max_timestamp__lte=auto_completion_threshold)

        for order in max_timestamp_orders:
            order_for_complete = Order.objects.filter(pk=order['order_id']).get()

            order_for_complete.status = 'completed'
            order_for_complete.save()

            print('Completed order', order['order_id'])
