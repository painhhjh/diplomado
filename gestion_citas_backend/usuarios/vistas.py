from rest_framework import generics, permissions
from django.contrib.auth.models import User
from .serializadores import CrearUsuarioSerializer

# Vista para crear un nuevo usuario (paciente o doctor)
class CrearUsuarioVista(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = CrearUsuarioSerializer
    permission_classes = [permissions.AllowAny] # Cualquiera puede registrarse