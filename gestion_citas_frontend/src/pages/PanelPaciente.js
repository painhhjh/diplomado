import React, { useState, useEffect } from 'react';
import FormularioCita from '../components/FormularioCita';
import { obtenerMisCitas } from '../services/api';

const PanelPaciente = () => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const cargarCitas = async () => {
      try {
        setLoading(true);
        const response = await obtenerMisCitas();
        setCitas(response.data);
      } catch (err) {
        setError('No se pudieron cargar las citas.');
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    cargarCitas();
  }, []);

  const handleCitaCreada = () => {
    // Vuelve a cargar la lista de citas después de crear una nueva
    cargarCitas();
  };

  return (
    <div>
      <h2>Panel del Paciente</h2>
      <hr />
      
      <h3>Solicitar Nueva Cita</h3>
      <FormularioCita onCitaCreada={handleCitaCreada} />
      
      <hr />

      <h3>Mis Próximas Citas</h3>
      {loading && <p>Cargando citas...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {citas.length > 0 ? citas.map((cita) => (
          <li key={cita.id}>
            <strong>Doctor:</strong> {cita.doctor_info.perfil.usuario.first_name} {cita.doctor_info.perfil.usuario.last_name} ({cita.doctor_info.especialidad.nombre}) <br/>
            <strong>Fecha y Hora:</strong> {new Date(cita.fecha_hora).toLocaleString()} <br/>
            <strong>Motivo:</strong> {cita.motivo_consulta} <br/>
            <strong>Estado:</strong> {cita.estado} <br/>
            <strong>Prioridad Asignada:</strong> {cita.puntuacion_prioridad}
          </li>
        )) : <p>No tienes citas programadas.</p>}
      </ul>
    </div>
  );
};

export default PanelPaciente;