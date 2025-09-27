import React, { useState, useEffect } from 'react';
import { registrar, obtenerEspecialidades } from '../services/api';

const Registro = ({ navegar }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('paciente');
  const [especialidad, setEspecialidad] = useState('');
  const [especialidades, setEspecialidades] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (role === 'doctor') {
      obtenerEspecialidades().then(res => setEspecialidades(res.data)).catch(() => setEspecialidades([]));
    }
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (role === 'doctor' && !especialidad) {
      setError('Debe seleccionar una especialidad.');
      return;
    }
    try {
      await registrar({
        username,
        password,
        first_name: firstName,
        last_name: lastName,
        email,
        rol: role,
        especialidad: role === 'doctor' ? parseInt(especialidad) : undefined
      });
      setSuccess('Usuario registrado correctamente. ¡Ahora puedes iniciar sesión!');
      setUsername('');
      setPassword('');
      setEmail('');
      setFirstName('');
      setLastName('');
      setRole('paciente');
      setEspecialidad('');
    } catch (err) {
      setError('Error al crear el usuario. Intenta nuevamente.');
      console.error(err);
    }
  };

  return (
    <div>
      {success && (
        <div style={{ color: 'green', marginBottom: '20px', fontWeight: 'bold', fontSize: '18px', border: '2px solid green', padding: '10px', borderRadius: '8px', background: '#eaffea' }}>
          {success}
        </div>
      )}
  <h2 style={{ color: 'white', textShadow: '1px 1px 4px #333' }}>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Usuario:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <br />
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <br />
        <div>
          <label>Apellido:</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <br />
        <div>
          <label>Correo electrónico:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <br />
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <br />
        <div>
          <label>Rol:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="paciente">Paciente</option>
            <option value="doctor">Doctor</option>
          </select>
        </div>
        <br />
        {role === 'doctor' && (
          <div>
            <label>Especialidad:</label>
            <select value={especialidad} onChange={e => setEspecialidad(e.target.value)} required>
              <option value="">Seleccione una especialidad</option>
              {especialidades.map(es => (
                <option key={es.id} value={es.id}>{es.nombre}</option>
              ))}
            </select>
          </div>
        )}
        {role === 'doctor' && <br />}
        <button
          type="submit"
          style={{
            background: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 20px',
            fontWeight: 'bold',
            fontSize: '16px',
            cursor: 'pointer',
            marginTop: '10px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
          }}
        >
          Registrar
        </button>
      </form>
      <button
        style={{
          background: '#43a047',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          padding: '10px 20px',
          fontWeight: 'bold',
          fontSize: '16px',
          cursor: 'pointer',
          marginTop: '20px',
          marginLeft: '0',
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
        }}
        onClick={() => navegar('login')}
      >
        Iniciar sesión
      </button>
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
    </div>
  );
};

export default Registro;
