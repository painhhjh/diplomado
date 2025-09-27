import React, { useState } from 'react';
import api from '../services/api';

const RecuperarContrasena = ({ navegar }) => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      await api.post('/usuarios/password_reset/', { email });
      setSuccess('Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña.');
      setEmail('');
    } catch (err) {
      setError('Error al solicitar recuperación. Intenta nuevamente.');
    }
  };

  return (
    <div>
  <h2 style={{ color: 'white', textShadow: '1px 1px 4px #333' }}>Recuperar Contraseña</h2>
      <form onSubmit={handleSubmit}>
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
          Enviar instrucciones
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
        Volver a iniciar sesión
      </button>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default RecuperarContrasena;
