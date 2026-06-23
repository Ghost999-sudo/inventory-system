import api from './api';

export const reportService = {
  fetchDashboard: async () => (await api.get('/reports/dashboard')).data
};
