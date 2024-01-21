from django.urls import path
from rest_framework.routers import DefaultRouter

from cart import views

router = DefaultRouter()

app_name = 'cart'

router.register('items', views.ShoppingCartItemViewSet, basename='cart-items')

urlpatterns = [
    *router.urls,
    path('items/checkout/', views.ShoppingCartItemViewSet.as_view({'post': 'checkout'}), name='checkout'),
]
