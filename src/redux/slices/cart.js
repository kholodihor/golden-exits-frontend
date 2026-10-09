import { createSlice } from '@reduxjs/toolkit';

const roundCents = value => Math.round(value * 100) / 100;

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
      const { product, quantity, price } = action.payload;
      if (!product || !product._id || quantity <= 0 || !price) return;

      const existingProduct = state.items.find(item => item.product._id === product._id);

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        state.items.push(action.payload);
      }
      state.quantity += quantity;
      state.total = roundCents(state.total + price * quantity);
    },
    removeProduct: (state, action) => {
      const itemToRemove = state.items.find(item => item.product._id === action.payload);
      if (!itemToRemove) return;

      state.items = state.items.filter(item => item !== itemToRemove);
      state.total = roundCents(state.total - itemToRemove.price * itemToRemove.quantity);
      state.quantity -= itemToRemove.quantity;
    },
    clearCart: state => {
      state.items = [];
      state.quantity = 0;
      state.total = 0;
    },
  },
});

export const { addProduct, removeProduct, clearCart } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;

export const selectCartItems = state => state.cart.items;
export const selectCartTotal = state => state.cart.total;
export const selectCartQuantity = state => state.cart.quantity;
