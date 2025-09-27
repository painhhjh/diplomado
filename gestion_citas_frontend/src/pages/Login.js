import React, { useState } from 'react';
import { login } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin, navegar }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // const [showRoleSelect, setShowRoleSelect] = useState(false); // Eliminado: no se usa
  const navigate = useNavigate();
  // const [userToken, setUserToken] = useState(''); // Eliminado: no se usa
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await login(username, password);
      localStorage.setItem('token', response.data.token);
  // setUserToken(response.data.token); // Eliminado: no se usa
      const rol = response.data.rol;
      if (rol === 'paciente') {
        navigate('/panel-paciente');
      } else if (rol === 'doctor') {
        navigate('/panel-doctor');
      } else {
        setError('No se pudo determinar el rol del usuario.');
      }
      if (onLogin) onLogin(rol);
    } catch (err) {
      setError('Error al iniciar sesión. Verifica tus credenciales.');
      console.error(err);
    }
  };

  // Ya no se necesita la selección manual de rol

  return (
    <div>
  <h2 style={{ color: 'white', textShadow: '1px 1px 4px #333' }}>Iniciar Sesión</h2>
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
      <br />
      <div>
        <button onClick={() => navegar('registro')}>
          Registrar usuario
        </button>
        <button style={{ marginLeft: '10px' }} onClick={() => navegar('recuperar-contrasena')}>
          Olvidé mi contraseña
        </button>
      </div>
    </div>
  );
};

export default Login;