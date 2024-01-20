from rest_framework.routers import DefaultRouter

from order import views

router = DefaultRouter()

app_name = 'order'

# router.register('', views.OrderViewSet)
#
urlpatterns = router.urls
