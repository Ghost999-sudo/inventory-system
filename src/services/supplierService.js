import api from './api';

export const supplierService = {
  fetchAll: async () => (await api.get('/suppliers')).data,
  create: async payload => (await api.post('/suppliers', payload)).data,
  update: async payload => (await api.put(`/suppliers/${payload.id}`, payload)).data,
  remove: async id => (await api.delete(`/suppliers/${id}`)).data
};
