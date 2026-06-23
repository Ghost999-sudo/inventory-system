import api from './api';

export async function login(credentials) {
  const { data } = await api.post('/auth/login', credentials);
  return data;
}

export async function registerUser(payload) {
  const { data } = await api.post('/auth/register', payload);
  return data;
}

export async function fetchUsers(status) {
  const { data } = await api.get('/auth/users', { params: status ? { status } : undefined });
  return data;
}

export async function approveUser(id, role) {
  const { data } = await api.patch(`/auth/users/${id}/approve`, null, { params: role ? { role } : undefined });
  return data;
}

export async function rejectUser(id) {
  const { data } = await api.patch(`/auth/users/${id}/reject`);
  return data;
}

export async function disableUser(id) {
  const { data } = await api.patch(`/auth/users/${id}/disable`);
  return data;
}

export async function requestPasswordReset(email) {
  const { data } = await api.post('/auth/password-reset/request', { email });
  return data;
}

export async function resetPassword(token, newPassword) {
  const { data } = await api.post('/auth/password-reset/confirm', { token, newPassword });
  return data;
}

export async function changePassword(currentPassword, newPassword) {
  const { data } = await api.post('/auth/change-password', { currentPassword, newPassword });
  return data;
}
