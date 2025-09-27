from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .modelos import Cita
from .serializadores import CitaSerializer, SolicitarCitaSerializer
from algoritmo_priorizacion.algoritmo import calcular_prioridad, encontrar_mejor_horario

class CitaViewSet(viewsets.ModelViewSet):
    queryset = Cita.objects.all().order_by('-puntuacion_prioridad', 'fecha_hora')
    serializer_class = CitaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Filtra las citas para que los pacientes solo vean las suyas
        y los doctores solo vean las que tienen asignadas.
        """
        user = self.request.user
        if hasattr(user, 'perfil'):
            if user.perfil.rol == 'paciente':
                return Cita.objects.filter(paciente=user.perfil.paciente)
            elif user.perfil.rol == 'doctor':
                return Cita.objects.filter(doctor=user.perfil.doctor)
        return Cita.objects.none()

    def create(self, request, *args, **kwargs):
        """
        Sobrescribe el método de creación para integrar el algoritmo de priorización.
        Flujo:
        1. Recibe la solicitud de cita del paciente.
        2. Calcula la prioridad con el algoritmo.
        3. Encuentra el mejor horario disponible.
        4. Crea y guarda la cita con la información calculada.
        5. Devuelve una respuesta al paciente.
        """
        serializer = SolicitarCitaSerializer(data=request.data)
        if serializer.is_valid():
            datos_cita = serializer.validated_data
            
            # 1. El paciente se asigna automáticamente desde el usuario autenticado
            paciente_actual = request.user.perfil.paciente
            
            # 2. Calcular la prioridad
            puntuacion = calcular_prioridad(datos_cita)
            
            # 3. Encontrar el mejor horario
            doctor_id = datos_cita['doctor'].id
            mejor_horario = encontrar_mejor_horario(doctor_id, puntuacion)
            
            if not mejor_horario:
                return Response(
                    {"error": "No hay horarios disponibles para el doctor seleccionado."},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            # 4. Crear y guardar la cita
            nueva_cita = Cita.objects.create(
                paciente=paciente_actual,
                doctor=datos_cita['doctor'],
                motivo_consulta=datos_cita['motivo_consulta'],
                nivel_urgencia=datos_cita['nivel_urgencia'],
                puntuacion_prioridad=puntuacion,
                fecha_hora=mejor_horario,
                estado='solicitada' # O 'confirmada' directamente si se quiere
            )
            
            # Marcar el horario como no disponible (lógica a mejorar)
            # ...

            # 5. Devolver la respuesta
            cita_serializer = CitaSerializer(nueva_cita)
            return Response(cita_serializer.data, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
