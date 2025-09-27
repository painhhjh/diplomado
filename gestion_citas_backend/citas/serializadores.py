from rest_framework import serializers
from .modelos import Cita
from usuarios.serializadores import UserSerializer
from doctores.serializadores import DoctorSerializer

class CitaSerializer(serializers.ModelSerializer):
    paciente_info = UserSerializer(source='paciente.perfil.usuario', read_only=True)
    doctor_info = DoctorSerializer(source='doctor', read_only=True)

    class Meta:
        model = Cita
        fields = '__all__'
        read_only_fields = ('paciente', 'puntuacion_prioridad', 'estado')


class SolicitarCitaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cita
        # El paciente solo necesita enviar estos campos
        fields = ['doctor', 'motivo_consulta', 'nivel_urgencia']
