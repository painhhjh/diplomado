from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .vistas import CitaViewSet

router = DefaultRouter()
router.register(r'', CitaViewSet, basename='cita')

urlpatterns = [
    path('', include(router.urls)),
]
