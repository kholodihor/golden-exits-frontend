import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/utils/axios';
import { logger } from '@/utils/logger';

// Comments are keyed by postId so several open posts don't share one list.
const initialState = {
  byPostId: {},
  loadingByPostId: {},
};

export const createComment = createAsyncThunk(
  'comment/createComment',
  async ({ postId, comment, userId, user }) => {
    try {
      const { data } = await axios.post(`/comments/${postId}`, {
        userId,
        comment,
        user,
        createdAt: new Date().toISOString(),
      });
      return data;
    } catch (error) {
      logger.error('Failed to create comment:', error);
      throw error;
    }
  }
);

export const getPostComments = createAsyncThunk(
  'comment/getPostComments',
  async (postId, { rejectWithValue }) => {
    try {
      // Try the new endpoint format first
      const { data } = await axios.get(`/comments/${postId}`);

      // Handle different API response formats
      if (data.success && Array.isArray(data.comments)) {
        // New API format: { success: true, comments: [...] }
        return data.comments;
      } else if (Array.isArray(data)) {
        // Old API format: direct array of comments
        return data;
      } else {
        // Fallback to empty array if no valid format is found
        return [];
      }
    } catch (error) {
      // If the new endpoint fails, try the old endpoint format as fallback
      try {
        const { data } = await axios.get(`/posts/comments/${postId}`);
        return Array.isArray(data) ? data : [];
      } catch (fallbackError) {
        logger.error('Failed to fetch post comments from both endpoints:', error, fallbackError);
        return rejectWithValue(error.response?.data || 'Failed to fetch comments');
      }
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
        // Handle the new API response format which returns { success: true, comment: {...} }
        // or the old format with newComment wrapper
        const newComment =
          action.payload.success && action.payload.comment
            ? action.payload.comment
            : action.payload.newComment || action.payload;

        if (!state.byPostId[postId]) state.byPostId[postId] = [];
        state.byPostId[postId].push(newComment);
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
