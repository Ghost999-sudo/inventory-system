import { createSlice } from '@reduxjs/toolkit';

const savedUser = localStorage.getItem('inventory_user');
const savedToken = localStorage.getItem('inventory_token');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: savedUser ? JSON.parse(savedUser) : null,
    token: savedToken || null,
    status: 'idle'
  },
  reducers: {
    loginSuccess(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('inventory_user', JSON.stringify(action.payload.user));
      localStorage.setItem('inventory_token', action.payload.token);
    },
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('inventory_user');
      localStorage.removeItem('inventory_token');
    }
  }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
