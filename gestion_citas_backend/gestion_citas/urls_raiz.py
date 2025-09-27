"""
URL configuration for gestion_citas project.
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('admin/', admin.site.urls),
    # URLs para las apps
    path('api/usuarios/', include('usuarios.urls')),
    path('api/doctores/', include('doctores.urls')),
    path('api/citas/', include('citas.urls')),
    # Endpoint para obtener el token de autenticación
    path('api/api-token-auth/', obtain_auth_token, name='api_token_auth'),
]
