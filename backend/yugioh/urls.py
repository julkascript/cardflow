from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

router.register('cards', views.YugiohCardViewSet)
router.register('cards_in_set', views.YugiohCardInSetViewSet)

app_name = 'yugioh'

urlpatterns = [
    path('', include(router.urls)),
]
