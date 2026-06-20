import api from './api';

export const mpesaService = {
  requestPayment: async payload => (await api.post('/payments/mpesa', payload)).data
};
