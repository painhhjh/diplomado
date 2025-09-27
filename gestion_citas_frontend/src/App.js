import React from 'react';

// En una aplicación real, usarías React Router para la navegación
import Inicio from './pages/Inicio';
import Login from './pages/Login';
import PanelPaciente from './pages/PanelPaciente';
import PanelDoctor from './pages/PanelDoctor';
import Registro from './pages/registro';
import RecuperarContrasena from './pages/RecuperarContrasena';

function App() {
  // Lógica simple de enrutamiento basada en el estado de autenticación
  // En un proyecto real, esto sería manejado por React Router y un contexto de autenticación
  const [usuario, setUsuario] = React.useState(null); // { rol: 'paciente' } o { rol: 'doctor' }
  const [paginaActual, setPaginaActual] = React.useState('login');

  // Simulación de login
  const handleLogin = (rol) => {
    setUsuario({ rol });
    setPaginaActual(rol === 'paciente' ? 'panelPaciente' : 'panelDoctor');
  };

  // Navegación simple
  const navegar = (pagina) => setPaginaActual(pagina);

  // Página a renderizar
  let pagina;
  
  if (!usuario) {
    // Si no hay usuario, podríamos mostrar login o la página de inicio
    // Para este ejemplo, mostraremos el login.
    if (paginaActual === 'login') {
      pagina = <Login onLogin={handleLogin} navegar={navegar} />;
    } else if (paginaActual === 'registro') {
      pagina = <Registro />;
    } else if (paginaActual === 'recuperar-contrasena') {
      pagina = <RecuperarContrasena />;
    } else {
      pagina = <Inicio />;
    }
  } else if (usuario.rol === 'paciente') {
    pagina = <PanelPaciente />;
  } else if (usuario.rol === 'doctor') {
    pagina = <PanelDoctor />;
  } else {
    pagina = <Inicio />;
  }

  return (
    <div className="App" style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <header>
        <h1>Gestión de Citas Médicas Inteligente</h1>
        <hr />
      </header>
      <main>
        {pagina}
      </main>
    </div>
  );
}

export default App;