from django.db import models
from usuarios.modelos import Paciente, Doctor

class Cita(models.Model):
    ESTADO_CHOICES = (
        ('solicitada', 'Solicitada'),
        ('confirmada', 'Confirmada'),
        ('cancelada', 'Cancelada'),
        ('completada', 'Completada'),
    )
    
    NIVEL_URGENCIA_CHOICES = (
        (1, 'Baja'),
        (2, 'Media'),
        (3, 'Alta'),
        (4, 'Muy Alta'),
    )

    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    fecha_hora = models.DateTimeField()
    motivo_consulta = models.TextField()
    nivel_urgencia = models.IntegerField(choices=NIVEL_URGENCIA_CHOICES)
    estado = models.CharField(max_length=15, choices=ESTADO_CHOICES, default='solicitada')
    puntuacion_prioridad = models.IntegerField(default=0) # Calculada por el algoritmo
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-puntuacion_prioridad', 'fecha_hora']

    def __str__(self):
        return f'Cita de {self.paciente} con {self.doctor} el {self.fecha_hora}'