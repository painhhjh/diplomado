import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api'; // URL de tu backend Django

// Crear una instancia de axios para reutilizar la configuración
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token de autenticación a cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Funciones de Autenticación ---

export const login = (username, password) => {
  return api.post('/usuarios/login/', { username, password });
};

export const registrar = (userData) => {
  // userData debe ser un objeto como { username, password, first_name, last_name, email, rol }
  return api.post('/usuarios/registrar/', userData);
};

// --- Funciones de Doctores ---

export const obtenerDoctores = () => {
    return api.get('/doctores/perfiles/');
}

export const obtenerEspecialidades = () => {
  return api.get('/doctores/especialidades/');
}

// --- Funciones de Citas ---

export const solicitarCita = (citaData) => {
    // citaData: { doctor, motivo_consulta, nivel_urgencia }
    return api.post('/citas/', citaData);
}

export const obtenerMisCitas = () => {
  return api.get('/citas/');
}

export const eliminarCita = (id) => {
  return api.delete(`/citas/${id}/`);
}

export const editarCita = (id, datos) => {
  return api.put(`/citas/${id}/`, datos);
}

export default api;