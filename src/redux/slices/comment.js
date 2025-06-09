import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/utils/axios';
import { logger } from '@/utils/logger';

const initialState = {
  comments: [],
  loading: false,
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
      console.log('Fetching comments for postId:', postId);
      // Try the new endpoint format first
      const { data } = await axios.get(`/comments/${postId}`);
      console.log('Received comments data:', data);

      // Handle different API response formats
      if (data.success && Array.isArray(data.comments)) {
        // New API format: { success: true, comments: [...] }
        return data.comments;
      } else if (Array.isArray(data)) {
        // Old API format: direct array of comments
        return data;
      } else {
        // Fallback to empty array if no valid format is found
        console.log('No valid comments data format found, returning empty array');
        return [];
      }
    } catch (error) {
      // If the new endpoint fails, try the old endpoint format as fallback
      try {
        console.log('First endpoint failed, trying fallback endpoint');
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
      .addCase(createComment.pending, state => {
        state.loading = true;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        // Handle the new API response format which returns { success: true, comment: {...} }
        // or the old format with newComment wrapper
        const newComment =
          action.payload.success && action.payload.comment
            ? action.payload.comment
            : action.payload.newComment || action.payload;

        console.log('Adding new comment to state:', newComment);
        state.comments.push(newComment);
      })
      .addCase(createComment.rejected, state => {
        state.loading = false;
      })
      .addCase(getPostComments.pending, state => {
        state.loading = true;
      })
      .addCase(getPostComments.fulfilled, (state, action) => {
        state.loading = false;
        // Make sure we have a valid payload before updating the state
        if (action.payload) {
          state.comments = action.payload;
          console.log('Updated comments in Redux store:', action.payload);
        } else {
          console.log('No comments data received from API');
          state.comments = [];
        }
      })
      .addCase(getPostComments.rejected, state => {
        state.loading = false;
      });
  },
});

export const commentReducer = commentSlice.reducer;
