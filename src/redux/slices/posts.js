import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/utils/axios';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const { data } = await axios.get('/posts');
  return data;
});

export const fetchPost = createAsyncThunk('posts/fetchPost', async id => {
  const { data } = await axios.get(`/posts/${id}`);
  return data;
});

export const createPost = createAsyncThunk('posts/createPost', async postData => {
  const { data } = await axios.post('/posts', postData);
  return data;
});

export const updatePost = createAsyncThunk('posts/updatePost', async ({ id, postData }) => {
  const { data } = await axios.patch(`/posts/${id}`, postData);
  return data;
});

export const removePost = createAsyncThunk('posts/removePost', async id => {
  await axios.delete(`/posts/${id}`);
  return id;
});

const initialState = {
  posts: {
    items: [],
    currentPost: null,
    status: 'idle',
    error: null,
  },
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearCurrentPost: state => {
      state.posts.currentPost = null;
    },
  },
  extraReducers: builder => {
    builder
      // Fetch all posts
      .addCase(fetchPosts.pending, state => {
        state.posts.status = 'loading';
        state.posts.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts.items = action.payload;
        state.posts.status = 'succeeded';
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.posts.status = 'failed';
        state.posts.error = action.error.message;
      })
      // Fetch single post
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.posts.currentPost = action.payload;
      })
      // Create post
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.items.unshift(action.payload);
      })
      // Update post
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.items.findIndex(post => post._id === action.payload._id);
        if (index !== -1) {
          state.posts.items[index] = action.payload;
        }
        if (state.posts.currentPost?._id === action.payload._id) {
          state.posts.currentPost = action.payload;
        }
      })
      // Remove post
      .addCase(removePost.fulfilled, (state, action) => {
        state.posts.items = state.posts.items.filter(post => post._id !== action.payload);
        if (state.posts.currentPost?._id === action.payload) {
          state.posts.currentPost = null;
        }
      });
  },
});

export const { clearCurrentPost } = postsSlice.actions;
export const postsReducer = postsSlice.reducer;
