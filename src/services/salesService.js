import api from './api';

export const salesService = {
  createSale: async payload => (await api.post('/sales', payload)).data,
  fetchSales: async () => (await api.get('/sales')).data
};
