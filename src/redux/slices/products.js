import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/utils/axios';
import { STATUS } from '../status';

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const { data } = await axios.get('/products');
  return data;
});

const initialState = {
  items: [],
  status: STATUS.IDLE,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending, state => {
        state.items = [];
        state.status = STATUS.LOADING;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = STATUS.SUCCEEDED;
      })
      .addCase(fetchProducts.rejected, state => {
        state.items = [];
        state.status = STATUS.FAILED;
      });
  },
});

export const selectProducts = state => state.products.items;
export const selectProductsStatus = state => state.products.status;

export const productsReducer = productsSlice.reducer;
