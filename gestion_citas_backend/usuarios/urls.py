from django.urls import path
from .vistas import CrearUsuarioVista

urlpatterns = [
    path('registrar/', CrearUsuarioVista.as_view(), name='registrar-usuario'),
]