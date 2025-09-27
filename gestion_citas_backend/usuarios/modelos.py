from django.db import models
from django.contrib.auth.models import User

# Modelo para extender el usuario base de Django y añadir un rol.
class Perfil(models.Model):
    ROL_CHOICES = (
        ('paciente', 'Paciente'),
        ('doctor', 'Doctor'),
    )
    usuario = models.OneToOneField(User, on_delete=models.CASCADE)
    rol = models.CharField(max_length=10, choices=ROL_CHOICES)
    telefono = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return f'{self.usuario.username} - {self.rol}'

# Modelo específico para Pacientes
class Paciente(models.Model):
    perfil = models.OneToOneField(Perfil, on_delete=models.CASCADE)
    # Aquí se podrían añadir campos específicos del paciente, como historial médico, etc.
    
    def __str__(self):
        return self.perfil.usuario.username

# Modelo específico para Doctores
class Doctor(models.Model):
    perfil = models.OneToOneField(Perfil, on_delete=models.CASCADE)
    especialidad = models.ForeignKey('doctores.Especialidad', on_delete=models.SET_NULL, null=True)
    
    def __str__(self):
        return f'Dr. {self.perfil.usuario.first_name} {self.perfil.usuario.last_name}'
