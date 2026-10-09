import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/utils/axios';
import { STATUS } from '../status';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const { data } = await axios.get('/posts');
  return data;
});

export const removePost = createAsyncThunk('posts/removePost', async id => {
  await axios.delete(`/posts/${id}`);
  return id;
});

const initialState = {
  items: [],
  status: STATUS.IDLE,
  error: null,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchPosts.pending, state => {
        state.status = STATUS.LOADING;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = STATUS.SUCCEEDED;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.error = action.error.message;
      })
      .addCase(removePost.fulfilled, (state, action) => {
        state.items = state.items.filter(post => post._id !== action.payload);
      });
  },
});

export const selectPosts = state => state.posts.items;
export const selectPostsStatus = state => state.posts.status;

export const postsReducer = postsSlice.reducer;
