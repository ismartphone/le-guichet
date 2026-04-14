import axios from 'axios';

const api = axios.create({
  baseURL: 'https://cc4e-2a01-cb15-45f-d700-352d-aa77-52c4-68a8.ngrok-free.app/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

// Injecter le token automatiquement
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const authAPI = {
  register: (data) => api.post('/register', data),
  login: (data) => api.post('/login', data),
  logout: () => api.post('/logout'),
  me: () => api.get('/me'),
};

// Clubs
export const clubsAPI = {
  getAll: () => api.get('/clubs'),
};

// Matchs
export const matchsAPI = {
  getAll: () => api.get('/matchs'),
  getOne: (id) => api.get(`/matchs/${id}`),
};

// Tribunes
export const tribunesAPI = {
  getByMatch: (matchId) => api.get(`/tribunes/${matchId}`),
};

// Réservations
export const reservationsAPI = {
  getAll: () => api.get('/reservations'),
  create: (data) => api.post('/reservations', data),
  cancel: (id) => api.delete(`/reservations/${id}`),
};

// Admin
export const adminAPI = {
  // Clubs
  createClub: (data) => api.post('/admin/clubs', data),
  updateClub: (id, data) => api.put(`/admin/clubs/${id}`, data),
  deleteClub: (id) => api.delete(`/admin/clubs/${id}`),
  // Matchs
  createMatch: (data) => api.post('/admin/matchs', data),
  updateMatch: (id, data) => api.put(`/admin/matchs/${id}`, data),
  deleteMatch: (id) => api.delete(`/admin/matchs/${id}`),
  syncMatchs: () => api.post('/admin/matchs/sync'),
  // Tribunes
  createTribune: (data) => api.post('/admin/tribunes', data),
  updateTribune: (id, data) => api.put(`/admin/tribunes/${id}`, data),
  deleteTribune: (id) => api.delete(`/admin/tribunes/${id}`),
};

export default api;
