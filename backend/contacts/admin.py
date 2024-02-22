from django.contrib import admin

from contacts.models import ContactForm


@admin.register(ContactForm)
class ContactFormAdmin(admin.ModelAdmin):
    list_display = ("email", "message")
    list_filter = ("email",)
    search_fields = ("email",)
