import React, { useState } from 'react';
import api from '../services/api';

const RecuperarContrasena = () => {
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
      <h2>Recuperar Contraseña</h2>
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
        <button type="submit">Enviar instrucciones</button>
        {success && <p style={{ color: 'green' }}>{success}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default RecuperarContrasena;
