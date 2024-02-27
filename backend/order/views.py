from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets, permissions, response

from order.filters import OrderFilter
from order.models import Order, FeedbackAndRating
from order.serializer import OrderSerializer, FeedbackAndRatingSerializer

from accounts.serializers import UserSerializer

User = get_user_model()


@extend_schema(tags=['Order'])
class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Viewset for API endpoint that allows to see the orders.

    - To view all Orders use the base endpoint (api/order/).
    - To view specific order use the endpoint (api/order/<id>/)

    - For pagination, use the following format: (/api/order/?page=2)
    """

    queryset = Order.objects.all().order_by('id')
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]

    filterset_class = OrderFilter


@extend_schema(tags=['Feedback and Rating'])
class FeedbackAndRatingViewSet(viewsets.ModelViewSet):
    """
    Viewset for API endpoint that allows to see the feedback and rating.

    - To view all feedback and rating use the base endpoint (api/feedback/).
    - To view specific feedback and rating use the endpoint (api/feedback/<id>/)

    - For pagination, use the following format: (/api/feedback/?page=2)
    """

    queryset = FeedbackAndRating.objects.all().order_by('id')
    serializer_class = FeedbackAndRatingSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    http_method_names = ['get', 'post']

    def list(self, request, *args, **kwargs):
        all_ratings = [rating['rating'] for rating in FeedbackAndRating.objects.values('rating')]
        all_comments = [comment['comment'] for comment in FeedbackAndRating.objects.values('comment')]
        order = [order['related_order'] for order in FeedbackAndRating.objects.values('related_order')]
        comment_for_user = [user['given_to'] for user in FeedbackAndRating.objects.values('given_to')]

        result = []

        for comment_for_user, order, rating, comment in zip(comment_for_user, order, all_ratings, all_comments):
            result.append({'rated_user': comment_for_user, 'order': order, 'user_rating': rating, 'comment': comment})

        return response.Response(result)

    def retrieve(self, request, *args, **kwargs):

        user = User.objects.get(id=kwargs['pk']).id
        avg_rating = UserSerializer.get_average_rating(user)
        comments = FeedbackAndRating.objects.filter(given_to=user).values('comment')

        result = [{'user': user, 'average_rating': avg_rating, 'comments': comments}]

        return response.Response(result)
