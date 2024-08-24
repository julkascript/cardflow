from django.urls import path

from .views import TradeListingViewSet

urlpatterns = [
    path('', TradeListingViewSet.as_view({'get': 'list', 'post': 'create'}), name='trades'),
    path('<int:pk>/', TradeListingViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update'}),
         name='trade_detail'),
    path('<int:pk>/negotiate/', TradeListingViewSet.as_view({'post': 'negotiate'})),
    path('<int:pk>/accept/', TradeListingViewSet.as_view({'post': 'accept'})),
    path('<int:pk>/reject/', TradeListingViewSet.as_view({'post': 'reject'})),
    path('<int:pk>/counter-offer/', TradeListingViewSet.as_view({'post': 'counter_offer'})),
]
