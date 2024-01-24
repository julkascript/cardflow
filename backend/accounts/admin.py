from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model

User = get_user_model()


class UserAdmin(BaseUserAdmin):
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        (_("Personal info"), {"fields": ("email", "first_name", "last_name", "phone_number", "city", "shipping_address", "avatar")}),
        (_("Permissions"),
         {
             "fields": (
                 "is_active",
                 "is_staff",
                 "is_superuser",
                 "groups",
                 "user_permissions",
             ),
         },
         ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "username", "password1", "password2", "email", "first_name",
                    "last_name", "is_active", "is_staff", "avatar", "is_superuser"
                ),
            },
        ),
    )
    list_display = (
        "username", "email", "first_name", "last_name",
        "phone_number", "city", "shipping_address", "is_active", "id", "last_login",
    )
    list_filter = ("username", "email", "is_superuser", "is_active")
    search_fields = ("username", "email", "first_name", "last_name")
    ordering = ("username", "email")
    list_per_page = 15
    readonly_fields = ('last_login', 'date_joined')


admin.site.register(User, UserAdmin)
