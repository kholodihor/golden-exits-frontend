import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/utils/axios';
import { apiErrorMessage } from '@/utils/apiError';

// Comments are keyed by postId so several open posts don't share one list.
const initialState = {
  byPostId: {},
  loadingByPostId: {},
};

export const createComment = createAsyncThunk(
  'comment/createComment',
  async ({ postId, comment }, { rejectWithValue }) => {
    try {
      // The server takes the author from the auth token and returns the populated comment.
      const { data } = await axios.post(`/comments/${postId}`, { comment });
      return data.newComment;
    } catch (error) {
      return rejectWithValue({ message: apiErrorMessage(error, 'Failed to add comment') });
    }
  }
);

export const getPostComments = createAsyncThunk(
  'comment/getPostComments',
  async (postId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/comments/${postId}`);
      return data.comments;
    } catch (error) {
      return rejectWithValue(apiErrorMessage(error, 'Failed to fetch comments'));
    }
  }
);

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(createComment.fulfilled, (state, action) => {
        const { postId } = action.meta.arg;
        if (!state.byPostId[postId]) state.byPostId[postId] = [];
        state.byPostId[postId].push(action.payload);
      })
      .addCase(getPostComments.pending, (state, action) => {
        state.loadingByPostId[action.meta.arg] = true;
      })
      .addCase(getPostComments.fulfilled, (state, action) => {
        const postId = action.meta.arg;
        state.loadingByPostId[postId] = false;
        state.byPostId[postId] = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getPostComments.rejected, (state, action) => {
        state.loadingByPostId[action.meta.arg] = false;
      });
  },
});

const EMPTY_COMMENTS = [];

export const selectPostComments = (state, postId) =>
  state.comment.byPostId[postId] || EMPTY_COMMENTS;

export const selectPostCommentsLoading = (state, postId) =>
  Boolean(state.comment.loadingByPostId[postId]);

export const commentReducer = commentSlice.reducer;
