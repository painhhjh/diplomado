from rest_framework import viewsets, permissions
from .modelos import Doctor, Especialidad, HorarioDisponible
from .serializadores import DoctorSerializer, EspecialidadSerializer, HorarioDisponibleSerializer

# ViewSet para ver la lista de doctores y sus perfiles
class DoctorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [permissions.IsAuthenticated] # Solo usuarios autenticados

# ViewSet para especialidades
class EspecialidadViewSet(viewsets.ModelViewSet):
    queryset = Especialidad.objects.all()
    serializer_class = EspecialidadSerializer
    permission_classes = [permissions.IsAdminUser] # Solo admins pueden gestionar especialidades

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