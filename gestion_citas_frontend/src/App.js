import React, { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Inicio from './pages/Inicio';
import Login from './pages/Login';
import PanelPaciente from './pages/PanelPaciente';
import PanelDoctor from './pages/PanelDoctor';
import Registro from './pages/registro';
import RecuperarContrasena from './pages/RecuperarContrasena';

function App() {
  const [usuario, setUsuario] = useState(null); // { rol: 'paciente' } o { rol: 'doctor' }
  const navigate = useNavigate();

  // Maneja el login y redirige automáticamente
  const handleLogin = (rol) => {
    setUsuario({ rol });
    if (rol === 'paciente') {
      navigate('/panel-paciente');
    } else if (rol === 'doctor') {
      navigate('/panel-doctor');
    }
  };

  // Logout: elimina token y usuario, redirige al login con confirmación
  const handleLogout = () => {
    if (window.confirm('¿Seguro que deseas cerrar sesión?')) {
      localStorage.removeItem('token');
      setUsuario(null);
      navigate('/login');
    }
  };

  // Navegación para registro y recuperación
  const navegar = (ruta) => {
    navigate(ruta === 'registro' ? '/registro' : ruta === 'recuperar-contrasena' ? '/recuperar-contrasena' : '/login');
  };

  return (
    <div className="App" style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <header>
        <h1 style={{ color: 'white', textShadow: '1px 1px 4px #333' }}>Gestión de Citas Médicas Inteligente</h1>
        <hr />
        {usuario && (
          <button onClick={handleLogout} style={{ float: 'right', marginTop: '-50px' }}>
            Cerrar sesión
          </button>
        )}
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login onLogin={handleLogin} navegar={navegar} />} />
          <Route path="/registro" element={<Registro navegar={navegar} />} />
          <Route path="/recuperar-contrasena" element={<RecuperarContrasena navegar={navegar} />} />
          <Route path="/panel-paciente" element={usuario?.rol === 'paciente' ? <PanelPaciente /> : <Navigate to="/login" />} />
          <Route path="/panel-doctor" element={usuario?.rol === 'doctor' ? <PanelDoctor /> : <Navigate to="/login" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;