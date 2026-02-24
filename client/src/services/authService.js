import api from './api.js';

export const authService = {
  async register(payload) {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('token', data.token);
    return data;
  },
  async login(payload) {
    const { data } = await api.post('/auth/login', payload);
    localStorage.setItem('token', data.token);
    return data;
  },
  logout() {
    localStorage.removeItem('token');
  }
};