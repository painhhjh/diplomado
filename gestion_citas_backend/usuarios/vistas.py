
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from django.conf import settings
from .serializadores import CrearUsuarioSerializer
from .modelos import Perfil

# Endpoint de login que retorna token y rol
class LoginAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            token, _ = Token.objects.get_or_create(user=user)
            # Obtener el rol desde el perfil
            try:
                perfil = user.perfil
                rol = perfil.rol
            except Perfil.DoesNotExist:
                rol = None
            return Response({'token': token.key, 'rol': rol})
        return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)

# Vista para crear un nuevo usuario (paciente o doctor)
class CrearUsuarioVista(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = CrearUsuarioSerializer
    permission_classes = [permissions.AllowAny] # Cualquiera puede registrarse

# Vista API para recuperación de contraseña
class PasswordResetAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email es requerido.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'No existe usuario con ese email.'}, status=status.HTTP_404_NOT_FOUND)

        # Generar nueva contraseña temporal
        new_password = get_random_string(length=8)
        user.set_password(new_password)
        user.save()

        # Enviar email
        send_mail(
            'Recuperación de contraseña',
            f'Tu nueva contraseña temporal es: {new_password}',
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )
        return Response({'message': 'Se ha enviado una nueva contraseña al correo.'}, status=status.HTTP_200_OK)