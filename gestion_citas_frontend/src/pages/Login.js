import React, { useState } from 'react';
import { login } from '../services/api';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await login(username, password);
      localStorage.setItem('token', response.data.token);
      
      // Aquí necesitarías otra llamada a la API para obtener el rol del usuario
      // Por simplicidad, lo simulamos
      console.log('Login exitoso, token:', response.data.token);

      // Simulación: Determina el rol (en una app real, la API debería devolverlo)
      // y llama a onLogin con el rol correcto.
      // Por ahora, lo dejamos para que el usuario elija en la UI de App.js
      alert('¡Inicio de sesión exitoso! (Simulado). Actualiza la página o implementa el enrutamiento.');
      // onLogin('paciente'); // o 'doctor'
      
    } catch (err) {
      setError('Error al iniciar sesión. Verifica tus credenciales.');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
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
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <br />
        <button type="submit">Ingresar</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default Login;