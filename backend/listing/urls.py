from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
# router.register('', views.ListingViewSet)
# router.register('search', views.ListingSearchViewSet)

urlpatterns = [
    path('', views.ListingViewSet.as_view({'get': 'list', 'post': 'create'}), name='listing'),
    path('<int:pk>/', views.ListingViewSet.as_view(
        {'get': 'retrieve', 'put': 'update', 'delete': 'destroy',
         'patch': 'partial_update'}), name='listing_detail'),
    path('search/', views.ListingSearchViewSet.as_view({'get': 'list'}), name='listing_search'),
    path('search/<int:pk>/', views.ListingSearchViewSet.as_view({'get': 'retrieve'}), name='listing_search_detail'),
]
