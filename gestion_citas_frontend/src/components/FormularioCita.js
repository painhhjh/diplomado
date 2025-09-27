import React, { useState, useEffect } from 'react';
import { obtenerDoctores, solicitarCita, editarCita } from '../services/api';

const FormularioCita = ({ onCitaCreada, cita }) => {
  const [doctores, setDoctores] = useState([]);
  const [doctorId, setDoctorId] = useState(cita ? cita.doctor : '');
  const [motivo, setMotivo] = useState(cita ? cita.motivo_consulta : '');
  const [urgencia, setUrgencia] = useState(cita ? cita.nivel_urgencia : 1);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!cita) {
      const cargarDoctores = async () => {
        try {
          const response = await obtenerDoctores();
          setDoctores(response.data);
        } catch (error) {
          console.error("Error cargando doctores", error);
        }
      };
      cargarDoctores();
    }
  }, [cita]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    if (cita) {
      // Edición: solo motivo
      try {
        await editarCita(cita.id, { motivo_consulta: motivo });
        setMensaje('¡Cita actualizada con éxito!');
        if (onCitaCreada) onCitaCreada();
      } catch (err) {
        setError(err.response?.data?.error || 'Ocurrió un error al editar la cita.');
      }
      return;
    }

    if (!doctorId) {
      setError('Por favor, seleccione un doctor.');
      return;
    }

    const datosCita = {
      doctor: parseInt(doctorId),
      motivo_consulta: motivo,
      nivel_urgencia: parseInt(urgencia),
    };

    try {
      await solicitarCita(datosCita);
      setMensaje('¡Cita solicitada con éxito! El sistema le ha asignado el mejor horario disponible.');
      setDoctorId('');
      setMotivo('');
      setUrgencia(1);
      if (onCitaCreada) {
        onCitaCreada();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Ocurrió un error al solicitar la cita.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {!cita && (
        <div>
          <label>Doctor:</label>
          <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)} required>
            <option value="">Seleccione un doctor</option>
            {doctores.map((doc) => (
              <option key={doc.id} value={doc.id}>
                Dr. {doc.perfil.usuario.first_name} {doc.perfil.usuario.last_name} ({doc.especialidad ? doc.especialidad.nombre : "Sin especialidad"})
              </option>
            ))}
          </select>
        </div>
      )}
      {!cita && <br />}
      <div>
        <label>Motivo de la Consulta:</label><br/>
        <textarea
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          rows="4"
          cols="50"
          required
        ></textarea>
      </div>
      <br />
      {!cita && (
        <div>
          <label>Nivel de Urgencia:</label>
          <select value={urgencia} onChange={(e) => setUrgencia(e.target.value)} required>
            <option value="1">Baja</option>
            <option value="2">Media</option>
            <option value="3">Alta</option>
            <option value="4">Muy Alta</option>
          </select>
        </div>
      )}
      {!cita && <br />}
  <button type="submit">{cita ? 'Guardar Cambios' : 'Solicitar Cita'}</button>
    </form>
  );
};

export default FormularioCita;