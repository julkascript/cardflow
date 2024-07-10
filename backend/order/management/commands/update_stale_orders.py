from datetime import timedelta

from django.core.management.base import BaseCommand
from django.db.models import Max
from django.utils import timezone
import pytz

from order.models import OrderStatusHistory, Order


class Command(BaseCommand):
    help = 'Marks stale orders as completed or not sent based on their status'

    def handle(self, *args, **options):
        eet = pytz.timezone('Europe/Helsinki')
        now_in_eet = timezone.now().astimezone(eet)

        self.stdout.write(f'Cron job started at {now_in_eet.strftime("%Y-%m-%d %H:%M:%S %Z%z")}')

        auto_completion_threshold = timezone.now() - timedelta(days=30)

        # Filter and process "sent" orders
        sent_orders = Order.objects.filter(status='sent')
        max_timestamp_sent_orders = OrderStatusHistory.objects.filter(order__in=sent_orders).values(
            'order_id').annotate(
            max_timestamp=Max('timestamp')).filter(max_timestamp__lte=auto_completion_threshold)
        sent_order_ids_to_complete = max_timestamp_sent_orders.values_list('order_id', flat=True)

        for order_id in sent_order_ids_to_complete:
            order = Order.objects.get(id=order_id)
            order.status = 'completed'
            order.save()

        # Filter and process "ordered" orders
        ordered_orders = Order.objects.filter(status='ordered')
        max_timestamp_ordered_orders = OrderStatusHistory.objects.filter(order__in=ordered_orders).values(
            'order_id').annotate(
            max_timestamp=Max('timestamp')).filter(max_timestamp__lte=auto_completion_threshold)
        ordered_order_ids_to_not_sent = max_timestamp_ordered_orders.values_list('order_id', flat=True)

        for order_id in ordered_order_ids_to_not_sent:
            order = Order.objects.get(id=order_id)
            order.status = 'not_sent'
            order.save()

        self.stdout.write(f'Updated {len(sent_order_ids_to_complete)} sent orders tos status "Completed"')
        self.stdout.write(f'Updated {len(ordered_order_ids_to_not_sent)} ordered orders to status "Not sent"')
