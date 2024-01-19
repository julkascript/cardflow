from rest_framework.routers import DefaultRouter

from cart import views

router = DefaultRouter()

app_name = 'cart'

router.register('items', views.ShoppingCartItemViewSet, basename='cart-items')

urlpatterns = router.urls
