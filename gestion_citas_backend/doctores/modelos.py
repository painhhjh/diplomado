from django.db import models
from usuarios.modelos import Doctor

class Especialidad(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    
    def __str__(self):
        return self.nombre

class HorarioDisponible(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='horarios')
    fecha = models.DateField()
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()
    disponible = models.BooleanField(default=True)
    
    def __str__(self):
        return f'{self.doctor} - {self.fecha} ({self.hora_inicio} - {self.hora_fin})'
