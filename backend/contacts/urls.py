from django.urls import path

from .views import ContactFormView

urlpatterns = [
    path("", ContactFormView.as_view()),
]
