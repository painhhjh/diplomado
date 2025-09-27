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
    especialidad = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = ('username', 'password', 'first_name', 'last_name', 'email', 'rol')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        rol = validated_data.pop('rol')
        especialidad_id = validated_data.pop('especialidad', None)
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
            from doctores.modelos import Especialidad
            if not especialidad_id:
                raise serializers.ValidationError({'especialidad': 'La especialidad es obligatoria para doctores.'})
            especialidad = Especialidad.objects.get(id=especialidad_id)
            Doctor.objects.create(perfil=perfil, especialidad=especialidad)
        return user
