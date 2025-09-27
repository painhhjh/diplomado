import React, { useState, useEffect } from 'react';
import { obtenerMisCitas } from '../services/api';

const PanelDoctor = () => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarAgenda = async () => {
      try {
        setLoading(true);
        const response = await obtenerMisCitas();
        // Las citas ya vienen ordenadas por prioridad desde el backend
        setCitas(response.data);
      } catch (err) {
        setError('No se pudo cargar su agenda.');
      } finally {
        setLoading(false);
      }
    };
    cargarAgenda();
  }, []);

  return (
    <div>
      <h2>Panel del Doctor - Mi Agenda</h2>
      {loading && <p>Cargando agenda...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {citas.length > 0 ? (
        <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', marginTop: '20px' }}>
            <thead>
                <tr>
                    <th>Prioridad</th>
                    <th>Fecha y Hora</th>
                    <th>Paciente</th>
                    <th>Motivo de Consulta</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
                {citas.map((cita) => (
                    <tr key={cita.id}>
                        <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{cita.puntuacion_prioridad}</td>
                        <td>{new Date(cita.fecha_hora).toLocaleString()}</td>
                        <td>{cita.paciente_info.first_name} {cita.paciente_info.last_name}</td>
                        <td>{cita.motivo_consulta}</td>
                        <td>{cita.estado}</td>
                    </tr>
                ))}
            </tbody>
        </table>
      ) : (
        <p>No tiene citas en su agenda.</p>
      )}
    </div>
  );
};

export default PanelDoctor;