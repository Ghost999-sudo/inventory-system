import api from './api';

export const customerService = {
  fetchAll: async () => (await api.get('/customers')).data,
  create: async payload => (await api.post('/customers', payload)).data,
  update: async payload => (await api.put(`/customers/${payload.id}`, payload)).data
};
