import { createSlice, nanoid } from '@reduxjs/toolkit';
import { initialProducts } from '../../data/mockData';

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    products: initialProducts
  },
  reducers: {
    addProduct(state, action) {
      state.products.unshift({ id: nanoid(), ...action.payload });
    },
    updateProduct(state, action) {
      const index = state.products.findIndex(product => product.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    adjustStock(state, action) {
      const product = state.products.find(item => item.id === action.payload.id);
      if (product) {
        product.quantity = Math.max(0, product.quantity + action.payload.delta);
      }
    }
  }
});

export const { addProduct, updateProduct, adjustStock } = inventorySlice.actions;
export default inventorySlice.reducer;
