from rest_framework import serializers
from .modelos import Especialidad, HorarioDisponible
from usuarios.serializadores import PerfilSerializer
from usuarios.modelos import Doctor

class EspecialidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Especialidad
        fields = '__all__'

class HorarioDisponibleSerializer(serializers.ModelSerializer):
    class Meta:
        model = HorarioDisponible
        fields = '__all__'

class DoctorSerializer(serializers.ModelSerializer):
    perfil = PerfilSerializer()
    especialidad = EspecialidadSerializer()
    horarios = HorarioDisponibleSerializer(many=True, read_only=True)

    class Meta:
        model = Doctor
        fields = ['id', 'perfil', 'especialidad', 'horarios']