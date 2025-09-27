import React, { useState, useEffect } from 'react';
import FormularioCita from '../components/FormularioCita';
import { eliminarCita } from '../services/api';
import { obtenerMisCitas } from '../services/api';

const PanelPaciente = () => {
  const [citas, setCitas] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [citaEditando, setCitaEditando] = useState(null);
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
    cargarCitas();
    setMostrarFormulario(false);
    setCitaEditando(null);
  };

  const handleEliminarCita = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta cita?')) {
      try {
        await eliminarCita(id);
        cargarCitas();
      } catch (err) {
        alert('Error al eliminar la cita.');
      }
    }
  };

  const handleEditarCita = (cita) => {
    setCitaEditando(cita);
    setMostrarFormulario(true);
  };

  return (
    <div>
  <h2 style={{ color: 'white', textShadow: '1px 1px 4px #333' }}>Panel del Paciente</h2>
      <hr />
      
      <button
        style={{ background: '#1976d2', color: 'white', border: 'none', borderRadius: '6px', padding: '10px 20px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginBottom: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}
        onClick={() => { setMostrarFormulario(true); setCitaEditando(null); }}
      >
        Agendar Cita
      </button>
      {mostrarFormulario && (
        <div>
          <h3>{citaEditando ? 'Editar Cita' : 'Solicitar Nueva Cita'}</h3>
          <FormularioCita onCitaCreada={handleCitaCreada} cita={citaEditando} />
          <button onClick={() => { setMostrarFormulario(false); setCitaEditando(null); }} style={{ marginTop: '10px' }}>Cancelar</button>
        </div>
      )}
      <hr />

      <h3>Mis Próximas Citas</h3>
      {loading && <p>Cargando citas...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {citas.length > 0 ? citas.map((cita) => (
          <li key={cita.id} style={{ marginBottom: '20px', background: '#f5f5f5', padding: '10px', borderRadius: '8px', color: '#222' }}>
            <strong>Doctor:</strong> {cita.doctor_info.perfil.usuario.first_name} {cita.doctor_info.perfil.usuario.last_name} ({cita.doctor_info.especialidad.nombre}) <br/>
            <strong>Fecha y Hora:</strong> {new Date(cita.fecha_hora).toLocaleString()} <br/>
            <strong>Motivo:</strong> {cita.motivo_consulta} <br/>
            <strong>Estado:</strong> {cita.estado} <br/>
            <strong>Prioridad Asignada:</strong> {cita.puntuacion_prioridad}<br/>
            <button style={{ marginRight: '10px', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer' }} onClick={() => handleEliminarCita(cita.id)}>Eliminar</button>
            <button style={{ background: '#1976d2', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer' }} onClick={() => handleEditarCita(cita)}>Editar</button>
          </li>
        )) : <p>No tienes citas programadas.</p>}
      </ul>
    </div>
  );
};

export default PanelPaciente;