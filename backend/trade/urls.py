from django.urls import path
from .views import TradeListingViewSet, TradeChatView

urlpatterns = [
    path('', TradeListingViewSet.as_view({'get': 'list', 'post': 'create'}), name='trades'),
    path('<int:pk>/', TradeListingViewSet.as_view({'get': 'retrieve'}), name='trade_detail'),
    path('<int:pk>/negotiate/', TradeListingViewSet.as_view({'patch': 'negotiate'}), name='trade_negotiate'),
    path('<int:pk>/accept/', TradeListingViewSet.as_view({'patch': 'accept'}), name='trade_accept'),
    path('<int:pk>/reject/', TradeListingViewSet.as_view({'patch': 'reject'}), name='trade_reject'),
    path('chat/<int:trade_id>/', TradeChatView.as_view(), name='trade_chat'),
]
