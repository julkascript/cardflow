from django.urls import path

from .views import TradeListingViewSet

urlpatterns = [
    path('', TradeListingViewSet.as_view({'get': 'list', 'post': 'create'}), name='trades'),
    path('<int:pk>/', TradeListingViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update'}),
         name='trade_detail'),
]
