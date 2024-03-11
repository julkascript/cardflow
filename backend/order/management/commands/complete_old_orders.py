from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from order.models import OrderStatusHistory


class Command(BaseCommand):
    help = 'Marks Sent orders older than 7 days as completed if they are not already completed'

    def handle(self, *args, **options):
        # Define the time threshold for auto-completion (7 days)
        auto_completion_threshold = timezone.now() - timedelta(minutes=1)

        # Filter orders with status 'sent'
        orders_to_complete = OrderStatusHistory.objects.filter(status='sent', timestamp__lte=auto_completion_threshold)

        # Filter orders that have not been completed within 7 days
        # orders_to_complete = orders_to_complete.exclude(
        #     status_history__timestamp__lte=auto_completion_threshold
        # )

        for order in orders_to_complete:
            print(order)
