"""
Módulo del Algoritmo de Priorización de Citas Médicas.
"""
from datetime import datetime, timedelta
from doctores.modelos import HorarioDisponible

def calcular_prioridad(datos_cita):
    """
    Calcula una puntuación de prioridad para una solicitud de cita.
    
    Args:
    datos_cita (dict): Un diccionario con 'nivel_urgencia', 'motivo_consulta'.
    
    Returns:
    int: Una puntuación de prioridad. A mayor puntuación, mayor prioridad.
    """
    puntuacion = 0
    
    # Prioridad base según el nivel de urgencia del paciente
    nivel_urgencia = int(datos_cita.get('nivel_urgencia', 1))
    puntuacion += nivel_urgencia * 25  # Ponderación alta para la urgencia
    
    # Analizar motivo de la consulta para ajustar la prioridad (ejemplo simple)
    motivo = datos_cita.get('motivo_consulta', '').lower()
    palabras_clave_alta_prioridad = ['dolor agudo', 'sangrado', 'fiebre alta', 'accidente', 'dificultad para respirar']
    
    if any(palabra in motivo for palabra in palabras_clave_alta_prioridad):
        puntuacion += 50
        
    return puntuacion

def encontrar_mejor_horario(doctor_id, puntuacion_prioridad):
    """
    Encuentra el mejor horario disponible para una cita priorizada.
    Por ahora, una implementación simple: busca el primer espacio disponible.
    
    Args:
    doctor_id (int): El ID del doctor solicitado.
    puntuacion_prioridad (int): La prioridad calculada de la cita.
    
    Returns:
    datetime: El mejor horario encontrado o None si no hay disponibilidad.
    """
    # Lógica simplificada: buscar el primer hueco disponible.
    # Una versión avanzada podría reorganizar citas de menor prioridad si la nueva es muy urgente.
    hoy = datetime.now().date()
    horarios_disponibles = HorarioDisponible.objects.filter(
        doctor_id=doctor_id,
        fecha__gte=hoy,
        disponible=True
    ).order_by('fecha', 'hora_inicio')

    if horarios_disponibles.exists():
        mejor_horario = horarios_disponibles.first()
        # Combinar fecha y hora para devolver un objeto datetime
        return datetime.combine(mejor_horario.fecha, mejor_horario.hora_inicio)

    return None
