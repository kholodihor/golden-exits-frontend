import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/utils/axios';

export const fetchComments = createAsyncThunk('comments/fetchComments', async postId => {
  const { data } = await axios.get(`/posts/${postId}/comments`);
  return data;
});

export const createComment = createAsyncThunk(
  'comments/createComment',
  async ({ postId, text }) => {
    const { data } = await axios.post(`/posts/${postId}/comments`, { text });
    return data;
  }
);

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async ({ postId, commentId }) => {
    await axios.delete(`/posts/${postId}/comments/${commentId}`);
    return { postId, commentId };
  }
);

const initialState = {
  comments: {
    items: {},
    status: 'idle',
    error: null,
  },
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchComments.pending, state => {
        state.comments.status = 'loading';
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments.items[action.meta.arg] = action.payload;
        state.comments.status = 'succeeded';
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.comments.status = 'failed';
        state.comments.error = action.error.message;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        const postId = action.meta.arg.postId;
        if (state.comments.items[postId]) {
          state.comments.items[postId].push(action.payload);
        }
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { postId, commentId } = action.payload;
        if (state.comments.items[postId]) {
          state.comments.items[postId] = state.comments.items[postId].filter(
            comment => comment._id !== commentId
          );
        }
      });
  },
});

export const commentsReducer = commentsSlice.reducer;
