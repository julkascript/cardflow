from django.shortcuts import render
from drf_spectacular.utils import extend_schema
from rest_framework import views, status
from django.core.mail import send_mail
from rest_framework.response import Response

from contacts.serializers import ContactFormSerializer


@extend_schema(tags=["Contact Form"])
class ContactFormView(views.APIView):
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
            "Contact Form Submission",
            f"Email: {email}\nMessage: {message}",
            "ha6tagz@gmail.com",
            ["simeon.s.todorov@gmail.com"],
            fail_silently=False,
        )

        return Response({"success": "Email sent successfully"}, status=status.HTTP_200_OK)
