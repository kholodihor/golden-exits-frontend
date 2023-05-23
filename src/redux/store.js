import { configureStore, combineReducers } from '@reduxjs/toolkit';

import { authReducer } from './slices/auth';
import { postsReducer } from './slices/posts';
import { newsReducer } from './slices/news';
import { commentReducer } from './slices/comment';
import { productsReducer } from './slices/products';
import { videoReducer } from './slices/videos';
import { cartReducer } from './slices/cart';

const rootReducer = combineReducers({
  auth: authReducer,
  posts: postsReducer,
  news: newsReducer,
  comment: commentReducer,
  products: productsReducer,
  videos: videoReducer,
  cart: cartReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});
