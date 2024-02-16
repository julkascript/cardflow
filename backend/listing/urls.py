from django.urls import path
from rest_framework.routers import DefaultRouter

from . import views
from .views import BuyListingViewSet

router = DefaultRouter()
# router.register('', views.ListingViewSet)
# router.register('search', views.ListingSearchViewSet)

app_name = 'listing'

urlpatterns = [
    path('', views.ListingViewSet.as_view({'get': 'list', 'post': 'create'}), name='listings'),
    path('<int:pk>/', views.ListingViewSet.as_view(
        {'get': 'retrieve', 'put': 'update', 'delete': 'destroy',
         'patch': 'partial_update'}), name='listing_detail'),

    # path('<int:pk>/buy/', BuyListingViewSet.as_view({'put': 'mark_as_sold'}), name='listing_buy'),
    path('unsold/', BuyListingViewSet.as_view({'get': 'unsold_listings'}), name='unsold_listings'),
    path('sold/', BuyListingViewSet.as_view({'get': 'sold_listings'}), name='sold_listings'),

]
