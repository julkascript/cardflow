from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from accounts.views import RegistrationView, MyTokenObtainPairView

router = DefaultRouter()

router.register('register', RegistrationView, basename='register')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', MyTokenObtainPairView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='refresh'),
]
