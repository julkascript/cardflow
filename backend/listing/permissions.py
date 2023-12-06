from rest_framework import permissions


class IsOwner(permissions.BasePermission):

    """"
    This Permission class Check if the user making the request is the creator of the listing

    """

    def has_object_permission(self, request, view, obj):


        return obj.user == request.user
