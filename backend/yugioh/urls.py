from django.urls import path, include
from rest_framework.routers import DefaultRouter
from yugioh import views

router = DefaultRouter()

router.register('yugioh', views.YugiohViewSet)

app_name = 'yugioh'

urlpatterns = [
    path('', include(router.urls)),
]
