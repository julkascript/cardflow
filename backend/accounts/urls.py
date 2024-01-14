from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from accounts.views import RegistrationView, MyTokenObtainPairView, UserUpdateView

router = DefaultRouter()

app_name = 'accounts'

router.register('register', RegistrationView, basename='register')
# router.register('update', UserUpdateView, basename='account_update')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', MyTokenObtainPairView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('update/<int:pk>/', UserUpdateView.as_view(), name='account_update'),
]
