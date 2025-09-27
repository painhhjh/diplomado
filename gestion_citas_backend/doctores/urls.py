from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .vistas import DoctorViewSet, EspecialidadViewSet, HorarioDisponibleViewSet

router = DefaultRouter()
router.register(r'perfiles', DoctorViewSet)
router.register(r'especialidades', EspecialidadViewSet)
router.register(r'horarios', HorarioDisponibleViewSet, basename='horario')

urlpatterns = [
    path('', include(router.urls)),
]
