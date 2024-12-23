import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  quantity: 0,
  total: 0,
  error: null,
  loading: false
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addProduct: (state, action) => {
      try {
        const { product, quantity, price } = action.payload;
        if (!product || !product._id || quantity <= 0 || !price) {
          throw new Error('Invalid product data');
        }

        const existingProduct = state.items.find(
          (item) => item.product._id === product._id
        );

        if (existingProduct) {
          existingProduct.quantity += quantity;
          state.total += price * quantity;
        } else {
          state.items.push(action.payload);
          state.quantity += quantity;
          state.total += price * quantity;
        }
        state.error = null;
      } catch (error) {
        state.error = error.message;
      }
    },
    removeProduct: (state, action) => {
      try {
        const itemToRemove = state.items.find(
          (item) => item.product._id === action.payload
        );

        if (!itemToRemove) {
          throw new Error('Product not found in cart');
        }

        state.items = state.items.filter(
          (item) => item !== itemToRemove
        );
        state.total -= itemToRemove.price * itemToRemove.quantity;
        state.quantity -= itemToRemove.quantity;
        state.error = null;
      } catch (error) {
        state.error = error.message;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.quantity = 0;
      state.total = 0;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
});

export const { addProduct, removeProduct, clearCart, setError, clearError } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => state.cart.total;
export const selectCartQuantity = (state) => state.cart.quantity;
export const selectCartError = (state) => state.cart.error;
