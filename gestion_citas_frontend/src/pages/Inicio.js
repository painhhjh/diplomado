import React from 'react';
import { useNavigate } from 'react-router-dom';

const Inicio = () => {
  const navigate = useNavigate();
  return (
    <div>
  <h2 style={{ color: 'white', textShadow: '1px 1px 4px #333' }}>Bienvenido al Sistema de Gestión de Citas Médicas</h2>
      <p>
        Optimice la gestión de su salud con nuestro sistema inteligente.<br />
        Por favor, inicie sesión para continuar.
      </p>
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => navigate('/login')}>Ingresar</button>
        <button style={{ marginLeft: '10px' }} onClick={() => navigate('/registro')}>Registrar usuario</button>
      </div>
    </div>
  );
};

export default Inicio;
