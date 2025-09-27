from rest_framework import viewsets, permissions
from usuarios.modelos import Doctor
from .modelos import Especialidad, HorarioDisponible
from .serializadores import DoctorSerializer, EspecialidadSerializer, HorarioDisponibleSerializer

# ViewSet para ver la lista de doctores y sus perfiles
class DoctorViewSet(viewsets.ReadOnlyModelViewSet):
    def update(self, request, *args, **kwargs):
        """
        Permite al doctor cambiar su especialidad.
        Solo el propio doctor puede modificar su perfil.
        """
        instance = self.get_object()
        user = request.user
        if hasattr(user, 'perfil') and user.perfil.rol == 'doctor' and instance.perfil == user.perfil:
            especialidad_id = request.data.get('especialidad')
            if not especialidad_id:
                return Response({'error': 'Debe especificar la especialidad.'}, status=400)
            from .modelos import Especialidad
            try:
                especialidad = Especialidad.objects.get(id=especialidad_id)
            except Especialidad.DoesNotExist:
                return Response({'error': 'Especialidad no encontrada.'}, status=404)
            instance.especialidad = especialidad
            instance.save()
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        return Response({'error': 'No tiene permisos para modificar este perfil.'}, status=403)
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [permissions.IsAuthenticated] # Solo usuarios autenticados

# ViewSet para especialidades
class EspecialidadViewSet(viewsets.ModelViewSet):
    queryset = Especialidad.objects.all()
    serializer_class = EspecialidadSerializer
    permission_classes = [permissions.IsAuthenticated] # Cualquier usuario autenticado puede gestionar especialidades

# ViewSet para que los doctores gestionen su horario
class HorarioDisponibleViewSet(viewsets.ModelViewSet):
    serializer_class = HorarioDisponibleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Un doctor solo puede ver y gestionar su propio horario
        user = self.request.user
        if hasattr(user, 'perfil') and user.perfil.rol == 'doctor':
            return HorarioDisponible.objects.filter(doctor=user.perfil.doctor)
        return HorarioDisponible.objects.none()

    def perform_create(self, serializer):
        # Asigna el doctor actual al crear un nuevo horario
        doctor = self.request.user.perfil.doctor
        serializer.save(doctor=doctor)