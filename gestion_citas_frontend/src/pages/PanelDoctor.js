import React, { useState, useEffect } from 'react';
import { obtenerMisCitas, eliminarCita, editarCita, obtenerDoctores } from '../services/api';

const PanelDoctor = () => {
  const [citas, setCitas] = useState([]);
  const [editando, setEditando] = useState(null);
  const [doctores, setDoctores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarAgenda = async () => {
      try {
        setLoading(true);
        const response = await obtenerMisCitas();
        setCitas(response.data);
      } catch (err) {
        setError('No se pudo cargar su agenda.');
      } finally {
        setLoading(false);
      }
    };
    cargarAgenda();
    const cargarDoctores = async () => {
      try {
        const response = await obtenerDoctores();
        setDoctores(response.data);
      } catch {}
    };
    cargarDoctores();
  }, []);
  const handleEliminar = async (id) => {
    if (window.confirm('¿Seguro que desea eliminar esta cita?')) {
      try {
        await eliminarCita(id);
        setCitas(citas.filter(c => c.id !== id));
      } catch {
        alert('Error al eliminar la cita.');
      }
    }
  };

  const handleEditar = (cita) => {
    // Asegura que el campo doctor sea el id, no el objeto
    setEditando({
      ...cita,
      doctor: cita.doctor_info?.id || cita.doctor // usa el id si existe, si no el valor actual
    });
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    const datos = {
      motivo_consulta: editando.motivo_consulta,
      nivel_urgencia: editando.nivel_urgencia,
      fecha_hora: editando.fecha_hora,
      doctor: editando.doctor,
      estado: editando.estado
    };
    try {
      await editarCita(editando.id, datos);
      setEditando(null);
      setLoading(true);
      const response = await obtenerMisCitas();
      setCitas(response.data);
      setLoading(false);
    } catch {
      alert('Error al guardar los cambios.');
    }
  };

  return (
    <div>
  <h2 style={{ color: 'white', textShadow: '1px 1px 4px #333' }}>Panel del Doctor - Mi Agenda</h2>
      {loading && <p>Cargando agenda...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {editando ? (
        <form onSubmit={handleGuardar} style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
          <h3>Editar Cita</h3>
          <div>
            <label>Motivo:</label><br/>
            <textarea value={editando.motivo_consulta} onChange={e => setEditando({ ...editando, motivo_consulta: e.target.value })} rows="3" cols="50" required />
          </div>
          <div>
            <label>Nivel de Urgencia:</label>
            <select value={editando.nivel_urgencia} onChange={e => setEditando({ ...editando, nivel_urgencia: parseInt(e.target.value) })} required>
              <option value={1}>Baja</option>
              <option value={2}>Media</option>
              <option value={3}>Alta</option>
              <option value={4}>Muy Alta</option>
            </select>
          </div>
          <div>
            <label>Fecha y Hora:</label>
            <input type="datetime-local" value={editando.fecha_hora.slice(0,16)} onChange={e => setEditando({ ...editando, fecha_hora: e.target.value })} required />
          </div>
          <div>
            <label>Doctor:</label>
            <select value={editando.doctor} onChange={e => setEditando({ ...editando, doctor: parseInt(e.target.value) })} required>
              {doctores.filter(doc => doc && doc.especialidad).map(doc => (
                <option key={doc.id} value={doc.id}>
                  Dr. {doc.perfil?.usuario?.first_name || ''} {doc.perfil?.usuario?.last_name || ''} ({doc.especialidad?.nombre || ''})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Estado:</label>
            <select value={editando.estado} onChange={e => setEditando({ ...editando, estado: e.target.value })} required>
              <option value="solicitada">Solicitada</option>
              <option value="confirmada">Confirmada</option>
              <option value="cancelada">Cancelada</option>
              <option value="completada">Completada</option>
            </select>
          </div>
          <button type="submit" style={{ marginTop: '10px', background: '#1976d2', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer' }}>Guardar Cambios</button>
          <button type="button" style={{ marginLeft: '10px', marginTop: '10px' }} onClick={() => setEditando(null)}>Cancelar</button>
        </form>
      ) : (
        citas.length > 0 ? (
          <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', marginTop: '20px' }}>
              <thead>
                  <tr>
                      <th>Prioridad</th>
                      <th>Fecha y Hora</th>
                      <th>Paciente</th>
                      <th>Motivo de Consulta</th>
                      <th>Estado</th>
                      <th>Acciones</th>
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
                          <td>
                            <button style={{ marginRight: '8px', background: '#1976d2', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer' }} onClick={() => handleEditar(cita)}>Editar</button>
                            <button style={{ background: '#d32f2f', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer' }} onClick={() => handleEliminar(cita.id)}>Eliminar</button>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
        ) : (
          <p>No tiene citas en su agenda.</p>
        )
      )}
    </div>
  );
};

export default PanelDoctor;