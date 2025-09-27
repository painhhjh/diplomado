import React, { useState, useEffect } from 'react';
import { obtenerDoctores, solicitarCita } from '../services/api';

const FormularioCita = ({ onCitaCreada }) => {
  const [doctores, setDoctores] = useState([]);
  const [doctorId, setDoctorId] = useState('');
  const [motivo, setMotivo] = useState('');
  const [urgencia, setUrgencia] = useState(1);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarDoctores = async () => {
      try {
        const response = await obtenerDoctores();
        setDoctores(response.data);
      } catch (error) {
        console.error("Error cargando doctores", error);
      }
    };
    cargarDoctores();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');

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
      // Limpiar formulario
      setDoctorId('');
      setMotivo('');
      setUrgencia(1);
      // Notificar al componente padre para que actualice la lista
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
      
      <div>
        <label>Doctor:</label>
        <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)} required>
          <option value="">Seleccione un doctor</option>
          {doctores.map((doc) => (
            <option key={doc.id} value={doc.id}>
              Dr. {doc.perfil.usuario.first_name} {doc.perfil.usuario.last_name} ({doc.especialidad.nombre})
            </option>
          ))}
        </select>
      </div>
      <br />
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
      <div>
        <label>Nivel de Urgencia:</label>
        <select value={urgencia} onChange={(e) => setUrgencia(e.target.value)} required>
          <option value="1">Baja</option>
          <option value="2">Media</option>
          <option value="3">Alta</option>
          <option value="4">Muy Alta</option>
        </select>
      </div>
      <br />
      <button type="submit">Solicitar Cita</button>
    </form>
  );
};

export default FormularioCita;