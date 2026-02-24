import api from './api.js';

export const designService = {
  list: async () => (await api.get('/designs')).data,
  create: async payload => (await api.post('/designs', payload)).data,
  update: async (id, payload) => (await api.put(`/designs/${id}`, payload)).data,
  remove: async id => (await api.delete(`/designs/${id}`)).data
};