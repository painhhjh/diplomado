-- Especialidades
INSERT INTO doctores_especialidad (nombre) VALUES
  ('Cardiología'),
  ('Pediatría'),
  ('Dermatología'),
  ('Neurología'),
  ('Ginecología');

-- Usuarios doctores
INSERT INTO auth_user (username, password, first_name, last_name, email, is_staff, is_active, is_superuser, date_joined)
VALUES
  ('doctor1', 'pbkdf2_sha256$1000000$U2JBEz1OYdCr00MKA62zp4$sGpzact1DhjCAZsBYtqOMdTai61QaNO8RvnA21tTp60=', 'Doc1', 'Apellido', 'doctor1@mail.com', FALSE, TRUE, FALSE, NOW()),
  ('doctor2', 'pbkdf2_sha256$1000000$U2JBEz1OYdCr00MKA62zp4$sGpzact1DhjCAZsBYtqOMdTai61QaNO8RvnA21tTp60=', 'Doc2', 'Apellido', 'doctor2@mail.com', FALSE, TRUE, FALSE, NOW()),
  ('doctor3', 'pbkdf2_sha256$1000000$U2JBEz1OYdCr00MKA62zp4$sGpzact1DhjCAZsBYtqOMdTai61QaNO8RvnA21tTp60=', 'Doc3', 'Apellido', 'doctor3@mail.com', FALSE, TRUE, FALSE, NOW()),
  ('doctor4', 'pbkdf2_sha256$1000000$U2JBEz1OYdCr00MKA62zp4$sGpzact1DhjCAZsBYtqOMdTai61QaNO8RvnA21tTp60=', 'Doc4', 'Apellido', 'doctor4@mail.com', FALSE, TRUE, FALSE, NOW()),
  ('doctor5', 'pbkdf2_sha256$1000000$U2JBEz1OYdCr00MKA62zp4$sGpzact1DhjCAZsBYtqOMdTai61QaNO8RvnA21tTp60=', 'Doc5', 'Apellido', 'doctor5@mail.com', FALSE, TRUE, FALSE, NOW());

-- Usuarios pacientes
INSERT INTO auth_user (username, password, first_name, last_name, email, is_staff, is_active, is_superuser, date_joined)
VALUES
  ('paciente1', 'pbkdf2_sha256$1000000$U2JBEz1OYdCr00MKA62zp4$sGpzact1DhjCAZsBYtqOMdTai61QaNO8RvnA21tTp60=', 'Pac1', 'Apellido', 'paciente1@mail.com', FALSE, TRUE, FALSE, NOW()),
  ('paciente2', 'pbkdf2_sha256$1000000$U2JBEz1OYdCr00MKA62zp4$sGpzact1DhjCAZsBYtqOMdTai61QaNO8RvnA21tTp60=', 'Pac2', 'Apellido', 'paciente2@mail.com', FALSE, TRUE, FALSE, NOW()),
  ('paciente3', 'pbkdf2_sha256$1000000$U2JBEz1OYdCr00MKA62zp4$sGpzact1DhjCAZsBYtqOMdTai61QaNO8RvnA21tTp60=', 'Pac3', 'Apellido', 'paciente3@mail.com', FALSE, TRUE, FALSE, NOW()),
  ('paciente4', 'pbkdf2_sha256$1000000$U2JBEz1OYdCr00MKA62zp4$sGpzact1DhjCAZsBYtqOMdTai61QaNO8RvnA21tTp60=', 'Pac4', 'Apellido', 'paciente4@mail.com', FALSE, TRUE, FALSE, NOW()),
  ('paciente5', 'pbkdf2_sha256$1000000$U2JBEz1OYdCr00MKA62zp4$sGpzact1DhjCAZsBYtqOMdTai61QaNO8RvnA21tTp60=', 'Pac5', 'Apellido', 'paciente5@mail.com', FALSE, TRUE, FALSE, NOW());

-- Perfiles doctores
INSERT INTO usuarios_perfil (usuario_id, rol, telefono)
VALUES
  ((SELECT id FROM auth_user WHERE username='doctor1'), 'doctor', ''),
  ((SELECT id FROM auth_user WHERE username='doctor2'), 'doctor', ''),
  ((SELECT id FROM auth_user WHERE username='doctor3'), 'doctor', ''),
  ((SELECT id FROM auth_user WHERE username='doctor4'), 'doctor', ''),
  ((SELECT id FROM auth_user WHERE username='doctor5'), 'doctor', '');

-- Perfiles pacientes
INSERT INTO usuarios_perfil (usuario_id, rol, telefono)
VALUES
  ((SELECT id FROM auth_user WHERE username='paciente1'), 'paciente', ''),
  ((SELECT id FROM auth_user WHERE username='paciente2'), 'paciente', ''),
  ((SELECT id FROM auth_user WHERE username='paciente3'), 'paciente', ''),
  ((SELECT id FROM auth_user WHERE username='paciente4'), 'paciente', ''),
  ((SELECT id FROM auth_user WHERE username='paciente5'), 'paciente', '');

-- Doctores
INSERT INTO usuarios_doctor (perfil_id, especialidad_id)
VALUES
  ((SELECT id FROM usuarios_perfil WHERE usuario_id=(SELECT id FROM auth_user WHERE username='doctor1')), 1),
  ((SELECT id FROM usuarios_perfil WHERE usuario_id=(SELECT id FROM auth_user WHERE username='doctor2')), 2),
  ((SELECT id FROM usuarios_perfil WHERE usuario_id=(SELECT id FROM auth_user WHERE username='doctor3')), 3),
  ((SELECT id FROM usuarios_perfil WHERE usuario_id=(SELECT id FROM auth_user WHERE username='doctor4')), 4),
  ((SELECT id FROM usuarios_perfil WHERE usuario_id=(SELECT id FROM auth_user WHERE username='doctor5')), 5);

-- Pacientes
INSERT INTO usuarios_paciente (perfil_id)
VALUES
  ((SELECT id FROM usuarios_perfil WHERE usuario_id=(SELECT id FROM auth_user WHERE username='paciente1'))),
  ((SELECT id FROM usuarios_perfil WHERE usuario_id=(SELECT id FROM auth_user WHERE username='paciente2'))),
  ((SELECT id FROM usuarios_perfil WHERE usuario_id=(SELECT id FROM auth_user WHERE username='paciente3'))),
  ((SELECT id FROM usuarios_perfil WHERE usuario_id=(SELECT id FROM auth_user WHERE username='paciente4'))),
  ((SELECT id FROM usuarios_perfil WHERE usuario_id=(SELECT id FROM auth_user WHERE username='paciente5')));