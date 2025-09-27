from rest_framework import serializers
from django.contrib.auth.models import User
from .modelos import Perfil, Paciente, Doctor

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class PerfilSerializer(serializers.ModelSerializer):
    usuario = UserSerializer()

    class Meta:
        model = Perfil
        fields = ['usuario', 'rol', 'telefono']

class CrearUsuarioSerializer(serializers.ModelSerializer):
    rol = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('username', 'password', 'first_name', 'last_name', 'email', 'rol')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        rol = validated_data.pop('rol')
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            email=validated_data.get('email', '')
        )
        perfil = Perfil.objects.create(usuario=user, rol=rol)
        if rol == 'paciente':
            Paciente.objects.create(perfil=perfil)
        elif rol == 'doctor':
            # La especialidad se asignará después desde el perfil del doctor
            Doctor.objects.create(perfil=perfil)
        return user
