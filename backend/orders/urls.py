from rest_framework.routers import DefaultRouter

from orders import views

router = DefaultRouter()

app_name = 'orders'

router.register('', views.OrderViewSet)

urlpatterns = router.urls
