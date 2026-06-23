import api from './api';

export const productService = {
  fetchAll: async () => (await api.get('/products')).data,
  create: async payload => (await api.post('/products', payload)).data,
  update: async payload => (await api.put(`/products/${payload.id}`, payload)).data,
  adjustStock: async ({ id, delta }) => (await api.post(`/products/${id}/stock`, { productId: id, delta })).data,
  remove: async id => (await api.delete(`/products/${id}`)).data
};
