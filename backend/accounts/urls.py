from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from accounts.views import RegistrationView, MyTokenObtainPairView, UserUpdateView

router = DefaultRouter()

app_name = 'accounts'

router.register('register', RegistrationView, basename='register')
# router.register('user', UserUpdateView, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', MyTokenObtainPairView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('user/', UserUpdateView.as_view({'get': 'list'}), name='user_list'),
    path('user/<int:pk>/',
         UserUpdateView.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}),
         name='user_update'),
]
