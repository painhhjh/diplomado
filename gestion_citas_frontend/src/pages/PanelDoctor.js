import React, { useState, useEffect } from 'react';
import { obtenerMisCitas, eliminarCita, editarCita, obtenerDoctores, obtenerEspecialidades } from '../services/api';

const PanelDoctor = () => {
  const [citas, setCitas] = useState([]);
  const [editando, setEditando] = useState(null);
  const [doctores, setDoctores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [especialidades, setEspecialidades] = useState([]);
  const [especialidadActual, setEspecialidadActual] = useState(null);
  const [nuevaEspecialidad, setNuevaEspecialidad] = useState('');
  const [msgEspecialidad, setMsgEspecialidad] = useState('');
  const [nuevaEspecialidadNombre, setNuevaEspecialidadNombre] = useState('');
  const [msgNuevaEspecialidad, setMsgNuevaEspecialidad] = useState('');

  const handleAgregarEspecialidad = async (e) => {
    e.preventDefault();
    setMsgNuevaEspecialidad('');
    if (!nuevaEspecialidadNombre.trim()) return;
    try {
      // POST al backend para crear especialidad
      await fetch('http://127.0.0.1:8000/api/doctores/especialidades/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ nombre: nuevaEspecialidadNombre })
      });
      setMsgNuevaEspecialidad('Especialidad añadida correctamente.');
      setNuevaEspecialidadNombre('');
      // Recargar especialidades
      const res = await obtenerEspecialidades();
      setEspecialidades(res.data);
    } catch {
      setMsgNuevaEspecialidad('Error al añadir la especialidad.');
    }
  };
// Duplicado eliminado
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
        // Obtener especialidad actual del primer doctor (el propio)
        if (response.data.length > 0) {
          setEspecialidadActual(response.data[0].especialidad?.nombre || '');
        }
      } catch {}
    };
    cargarDoctores();
    const cargarEspecialidades = async () => {
      try {
        const res = await obtenerEspecialidades();
        setEspecialidades(res.data);
      } catch {}
    };
    cargarEspecialidades();
  }, []);
  const handleCambioEspecialidad = async (e) => {
    e.preventDefault();
    setMsgEspecialidad('');
    if (!nuevaEspecialidad) return;
    try {
      // PATCH al backend (deberás crear el endpoint en Django)
      await editarCita(doctores[0].id, { especialidad: parseInt(nuevaEspecialidad) });
      setEspecialidadActual(especialidades.find(es => es.id === parseInt(nuevaEspecialidad))?.nombre || '');
      setMsgEspecialidad('Especialidad actualizada correctamente.');
    } catch {
      setMsgEspecialidad('Error al actualizar la especialidad.');
    }
  };
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

  // Calcular citas que ocurren en 3 días
  const hoy = new Date();
  const tresDiasDespues = new Date(hoy);
  tresDiasDespues.setDate(hoy.getDate() + 3);
  const citasRecordatorio = citas.filter(cita => {
    const fechaCita = new Date(cita.fecha_hora);
    return fechaCita.getFullYear() === tresDiasDespues.getFullYear() &&
      fechaCita.getMonth() === tresDiasDespues.getMonth() &&
      fechaCita.getDate() === tresDiasDespues.getDate();
  });

  return (
    <div>
      <h2 style={{ color: 'white', textShadow: '1px 1px 4px #333' }}>Panel del Doctor - Mi Agenda</h2>
      {loading && <p>Cargando agenda...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {citasRecordatorio.length > 0 && (
        <div style={{ background: '#fffbe6', border: '2px solid #ffd600', color: '#222', padding: '16px', borderRadius: '10px', marginBottom: '20px', fontWeight: 'bold', fontSize: '17px' }}>
          <span role="img" aria-label="recordatorio">⏰</span> Tienes una cita médica en 3 días. ¡No olvides revisar tu agenda!
        </div>
      )}

      <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Cambiar Especialidad</h3>
        <p><strong>Especialidad actual:</strong> {especialidadActual || 'No asignada'}</p>
        <form onSubmit={handleCambioEspecialidad}>
          <select value={nuevaEspecialidad} onChange={e => setNuevaEspecialidad(e.target.value)} required>
            <option value="">Seleccione nueva especialidad</option>
            {especialidades.map(es => (
              <option key={es.id} value={es.id}>{es.nombre}</option>
            ))}
          </select>
          <button type="submit" style={{ marginLeft: '10px', background: '#1976d2', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer' }}>Actualizar</button>
        </form>
        {msgEspecialidad && <p style={{ color: msgEspecialidad.includes('Error') ? 'red' : 'green' }}>{msgEspecialidad}</p>}
        <hr />
        <h3>Añadir Nueva Especialidad</h3>
        <form onSubmit={handleAgregarEspecialidad}>
          <input type="text" value={nuevaEspecialidadNombre} onChange={e => setNuevaEspecialidadNombre(e.target.value)} placeholder="Nombre de la especialidad" required />
          <button type="submit" style={{ marginLeft: '10px', background: '#43a047', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer' }}>Añadir</button>
        </form>
        {msgNuevaEspecialidad && <p style={{ color: msgNuevaEspecialidad.includes('Error') ? 'red' : 'green' }}>{msgNuevaEspecialidad}</p>}
      </div>
      
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
}

export default PanelDoctor;
