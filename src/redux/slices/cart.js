import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  quantity: 0,
  total: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addProduct: (state, action) => {
      const existingProduct = state.items.find(
        (item) => item.product._id === action.payload.product._id
      );
      if (existingProduct) {
        existingProduct.quantity += action.payload.quantity;
        state.total += action.payload.price * action.payload.quantity;
      } else {
        state.items.push(action.payload);
        state.quantity += action.payload.quantity;
        state.total += action.payload.price * action.payload.quantity;
      }
    },
    removeProduct: (state, action) => {
      const itemToRemove = state.items.find(
        (item) => item.product._id === action.payload
      );
      state.items = state.items.filter(
        (item) => item !== itemToRemove
      );
      state.total -= itemToRemove.price * itemToRemove.quantity;
      state.quantity -= itemToRemove.quantity;
    },
  },
});

export const { addProduct, removeProduct } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
