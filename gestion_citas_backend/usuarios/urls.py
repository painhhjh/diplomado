from django.urls import path
from .vistas import CrearUsuarioVista, PasswordResetAPIView, LoginAPIView

urlpatterns = [
    path('registrar/', CrearUsuarioVista.as_view(), name='registrar-usuario'),
    path('password_reset/', PasswordResetAPIView.as_view(), name='password_reset'),
    path('login/', LoginAPIView.as_view(), name='login'),
]