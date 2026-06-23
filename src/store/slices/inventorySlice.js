import { createAsyncThunk, createSlice, nanoid } from '@reduxjs/toolkit';
import { productService } from '../../services/productService';

export const fetchProducts = createAsyncThunk('inventory/fetchProducts', async () => productService.fetchAll());

export const createProduct = createAsyncThunk('inventory/createProduct', async product => productService.create(product));

export const adjustProductStock = createAsyncThunk('inventory/adjustProductStock', async adjustment => productService.adjustStock(adjustment));

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    products: [],
    status: 'idle',
    error: null
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
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload);
      })
      .addCase(adjustProductStock.fulfilled, (state, action) => {
        const index = state.products.findIndex(product => product.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      });
  }
});

export const { addProduct, updateProduct, adjustStock } = inventorySlice.actions;
export default inventorySlice.reducer;
