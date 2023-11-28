from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.urls import include, path
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken

JWT_authenticator = JWTAuthentication()

User = get_user_model()


class JWTAuthorizationMiddleware:

    EXCLUDED_PATHS = [
        '/api/accounts/login/',
        '/api/accounts/register/',
        '/api/accounts/refresh/',
        '/',
        "/api/schema/",
        "/api/docs/",
    ]

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):

        if request.path in self.EXCLUDED_PATHS or request.path.startswith('/admin'):
            return self.get_response(request)

        if 'Authorization' not in request.headers:
            return JsonResponse({'error': 'Invalid Authorization header'}, status=401)

        auth_header = request.headers['Authorization']
        auth_parts = auth_header.split()

        if len(auth_parts) != 2 or auth_parts[0] != 'Bearer':
            return JsonResponse({'error': 'Invalid Type'}, status=401)

        try:
            token_response = JWT_authenticator.authenticate(request)
            user = self.has_access_rights(token_response, request)
            if not user:
                return JsonResponse({'error': 'Unauthorized access'}, status=401)
        except InvalidToken:
            return JsonResponse({'error': 'Invalid token or expired'}, status=401)
        except TokenError:
            return JsonResponse({'error': 'Invalid token'}, status=401)

        return self.get_response(request)

    def has_access_rights(self, token_response, request):

        try:
            user, _ = token_response

        except User.DoesNotExist:
            print('User does not exist')
            return None

        return bool(user.is_active)
