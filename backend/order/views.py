from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response

from rest_framework import viewsets, permissions, response, serializers


from order.filters import OrderFilter
from order.models import Order, FeedbackAndRating
from order.serializers import OrderSerializer, FeedbackAndRatingSerializer

from accounts.serializers import UserSerializer

User = get_user_model()


@extend_schema(tags=['Order'])
class OrderViewSet(viewsets.ReadOnlyModelViewSet, viewsets.mixins.UpdateModelMixin):
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
    Viewset for API endpoint that allows to see the feedback and rating. \n

        - To view all feedbacks and ratings use the base endpoint (api/feedback/).
        - To view feedbacks and ratings for specific user use the endpoint (api/feedback/user/<id>/)

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
        comment_for_user = [user['receiver_user'] for user in FeedbackAndRating.objects.values('receiver_user')]
        sender_user = [user['sender_user'] for user in FeedbackAndRating.objects.values('sender_user')]

        result = []

        for comment_for_user, order, sender_user, rating, comment in zip(comment_for_user, order, sender_user,
                                                                        all_ratings, all_comments):
            result.append(
                {'rated_user': comment_for_user, 'order': order, 'sender_user': sender_user, 'user_rating': rating,
                 'comment': comment})

        return response.Response(result)

    def retrieve(self, request, *args, **kwargs):

        user = User.objects.filter(id=kwargs['pk']).first()

        if not user:
            return response.Response('User not found', status=404)

        user_id = user.id
        avg_rating = UserSerializer.get_average_rating(user_id)
        orders = Order.objects.filter(sender_user=user_id).values('id')
        comments = FeedbackAndRating.objects.filter(receiver_user=user).values('comment')
        rating = FeedbackAndRating.objects.filter(receiver_user=user).values('rating')
        sender_user = FeedbackAndRating.objects.filter(receiver_user=user).values('sender_user')

        rating_and_comments = [
            {'related_order': o['id'], 'sender_user': g['sender_user'], 'rating': r['rating'], 'comment': c['comment']}
            for o, g, r, c in zip(orders, sender_user, rating, comments)]

        result = [{'user': user_id, 'average_rating': avg_rating, 'all_comments_and_ratings': rating_and_comments}]

        return response.Response(result)

    def perform_create(self, serializer):
        related_order = self.request.data['related_order']
        receiver_user = Order.objects.get(id=related_order).sender_user
        sender_user = Order.objects.get(id=related_order).receiver_user

        if serializer.is_valid():
            serializer.save(sender_user=sender_user, receiver_user=receiver_user)
