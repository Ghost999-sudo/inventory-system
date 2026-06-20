import { createSlice, nanoid } from '@reduxjs/toolkit';
import { initialSales } from '../../data/mockData';

const salesSlice = createSlice({
  name: 'sales',
  initialState: {
    orders: initialSales,
    cart: []
  },
  reducers: {
    addToCart(state, action) {
      const existing = state.cart.find(item => item.product.id === action.payload.product.id);
      if (existing) {
        existing.qty += action.payload.qty;
        return;
      }
      state.cart.push(action.payload);
    },
    updateCartQuantity(state, action) {
      const item = state.cart.find(entry => entry.product.id === action.payload.id);
      if (item) {
        item.qty = action.payload.qty;
      }
    },
    removeFromCart(state, action) {
      state.cart = state.cart.filter(item => item.product.id !== action.payload);
    },
    clearCart(state) {
      state.cart = [];
    },
    completeSale(state, action) {
      state.orders.unshift({
        id: nanoid(),
        createdAt: new Date().toISOString(),
        items: action.payload.items,
        paymentMethod: action.payload.paymentMethod,
        total: action.payload.total
      });
      state.cart = [];
    }
  }
});

export const { addToCart, updateCartQuantity, removeFromCart, clearCart, completeSale } = salesSlice.actions;
export default salesSlice.reducer;
