from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.utils import timezone
from citas.modelos import Cita
from usuarios.modelos import Paciente
from datetime import timedelta, time
from django.conf import settings

class Command(BaseCommand):
    help = 'Envía recordatorios de citas médicas por email 3 días antes a las 8 am.'

    def handle(self, *args, **kwargs):
        hoy = timezone.localdate()
        fecha_objetivo = hoy + timedelta(days=3)
        hora_objetivo = time(8, 0)  # 8:00 am
        citas = Cita.objects.filter(fecha_hora__date=fecha_objetivo)
        enviados = 0
        for cita in citas:
            paciente = cita.paciente.perfil.usuario
            email = paciente.email
            if not email:
                continue
            asunto = 'Recordatorio de cita médica'
            mensaje = f"Hola {paciente.first_name},\n\nTienes una cita médica el {cita.fecha_hora.strftime('%d/%m/%Y a las %H:%M')} con el Dr. {cita.doctor.perfil.usuario.first_name} {cita.doctor.perfil.usuario.last_name}.\n\nMotivo: {cita.motivo_consulta}\n\n¡No olvides asistir!"
            send_mail(
                asunto,
                mensaje,
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )
            enviados += 1
        self.stdout.write(self.style.SUCCESS(f'Recordatorios enviados: {enviados}'))
