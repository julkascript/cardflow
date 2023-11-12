from django.contrib.auth import get_user_model
from django.http import JsonResponse
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken

JWT_authenticator = JWTAuthentication()

User = get_user_model()


class JWTAuthorizationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.exclude_paths = ('/accounts/api/login/',)

    def __call__(self, request):

        if request.path in self.exclude_paths:
            return self.get_response(request)

        if 'Authorization' not in request.headers:
            return JsonResponse({'error': 'Invalid Authorization header'}, status=401)

        auth_header = request.headers['Authorization']
        auth_parts = auth_header.split()

        if len(auth_parts) != 2 or auth_parts[0] != 'Bearer':
            return JsonResponse({'error': 'Invalid Type'}, status=401)

        try:
            token_response = JWT_authenticator.authenticate(request)
            print('Authentication successful')
        except InvalidToken:
            print('Invalid token or expired')
            return JsonResponse({'error': 'Invalid token or expired'}, status=401)
        except TokenError:
            print('Token error')
            return JsonResponse({'error': 'Invalid token'}, status=401)

        # user = self.has_access_rights(response, request)

        return self.get_response(request)

    def has_access_rights(self, token_response, request):

        # try:
        #     user, _ = token_response
        #     if user.is_superuser:
        #         print('USER AUTHED')
        #     else:
        #         print("Regular user")
        # except User.DoesNotExist:
        #     print('User does not exist')
        #     return JsonResponse({'error': 'User does not exist'}, status=401)

        return True
