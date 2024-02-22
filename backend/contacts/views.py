from django.shortcuts import render
from drf_spectacular.utils import extend_schema
from rest_framework import views, status
from django.core.mail import send_mail
from rest_framework.response import Response

from contacts.serializers import ContactFormSerializer

from cardflow import settings


@extend_schema(tags=["Contact Form"])
class ContactFormView(views.APIView):
    """
    View for handling contact form submissions
    """
    serializer_class = ContactFormSerializer

    def post(self, request, *args, **kwargs):
        serializer_class = ContactFormSerializer(data=request.data)
        email = request.data.get("email")
        message = request.data.get("message")

        if not serializer_class.is_valid():
            if not email:
                return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
            if not message:
                return Response({"error": "Message is required"}, status=status.HTTP_400_BAD_REQUEST)

        serializer_class.save()
        send_mail(
            subject="Contact Form Submission",
            message=f"Email: {email}\nMessage: {message}",
            from_email=settings.CONTACT_FORM_EMAIL,
            recipient_list=[settings.CONTACT_FORM_EMAIL_RECIPIENT],
            fail_silently=False,
        )

        return Response({"success": "Email sent successfully"}, status=status.HTTP_200_OK)
