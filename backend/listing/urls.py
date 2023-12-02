from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('yugioh_listing', views.ListingViewSet)
router.register('yugioh_listing_search', views.ListingSearchViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
