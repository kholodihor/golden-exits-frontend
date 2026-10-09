import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/utils/axios';
import { apiErrorMessage } from '@/utils/apiError';
import { STATUS } from '../status';

export const fetchVideos = createAsyncThunk(
  'videos/fetchVideos',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/videos');
      return data;
    } catch (error) {
      return rejectWithValue(apiErrorMessage(error, 'Failed to fetch videos'));
    }
  }
);

export const fetchRemoveVideo = createAsyncThunk(
  'videos/fetchRemoveVideo',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/videos/${id}`);
      return { id, data };
    } catch (error) {
      return rejectWithValue(apiErrorMessage(error, 'Failed to remove video'));
    }
  },
  {
    condition: (id, { getState }) => getState().videos.removingId !== id,
  }
);

const initialState = {
  items: [],
  status: STATUS.IDLE,
  error: null,
  removingId: null,
};

const videoSlice = createSlice({
  name: 'videos',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchVideos.pending, state => {
        state.status = STATUS.LOADING;
        state.error = null;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = STATUS.SUCCEEDED;
        state.error = null;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.items = [];
        state.status = STATUS.FAILED;
        state.error = action.payload;
      })
      .addCase(fetchRemoveVideo.pending, (state, action) => {
        state.removingId = action.meta.arg;
      })
      .addCase(fetchRemoveVideo.fulfilled, (state, action) => {
        state.items = state.items.filter(video => video._id !== action.payload.id);
        state.removingId = null;
      })
      .addCase(fetchRemoveVideo.rejected, state => {
        state.removingId = null;
      });
  },
});

export const selectVideos = state => state.videos.items;
export const selectVideosStatus = state => state.videos.status;

export const videoReducer = videoSlice.reducer;
