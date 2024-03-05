from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView
from rest_framework import permissions

from accounts.views import ContactFormView

from order.views import FeedbackAndRatingViewSet
from cardflow import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/schema/', SpectacularAPIView.as_view(), name='api-schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='api-schema'), name='api-docs'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='api-schema'), name='api-redoc'),
    path('api/yugioh/', include('yugioh.urls')),
    path('api/accounts/', include('accounts.urls'), ),
    path('api/listing/', include('listing.urls')),
    path('api/order/', include('order.urls')),
    path('api/cart/', include('cart.urls')),
    path('api/contacts/', ContactFormView.as_view(), name='contact_form'),
    path('api/feedback/', FeedbackAndRatingViewSet.as_view({'get': 'list', 'post': 'create'}), name='feedback'),
    path('api/feedback/user/<int:pk>/', FeedbackAndRatingViewSet.as_view({'get': 'retrieve'}),)
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
