import { createAsyncThunk, createSlice, nanoid } from '@reduxjs/toolkit';
import { salesService } from '../../services/salesService';

export const fetchSales = createAsyncThunk('sales/fetchSales', async () => salesService.fetchSales());

export const createSale = createAsyncThunk('sales/createSale', async sale => salesService.createSale(sale));

const salesSlice = createSlice({
  name: 'sales',
  initialState: {
    orders: [],
    cart: [],
    status: 'idle',
    error: null
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
  },
  extraReducers: builder => {
    builder
      .addCase(fetchSales.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createSale.fulfilled, (state, action) => {
        state.orders.unshift(action.payload);
        state.cart = [];
      });
  }
});

export const { addToCart, updateCartQuantity, removeFromCart, clearCart, completeSale } = salesSlice.actions;
export default salesSlice.reducer;
