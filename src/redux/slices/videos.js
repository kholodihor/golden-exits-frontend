import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/utils/axios';

// Async thunks
export const fetchVideos = createAsyncThunk(
  'videos/fetchVideos',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/videos');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch videos');
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
      return rejectWithValue(error.response?.data?.message || 'Failed to remove video');
    }
  }
);

export const uploadVideo = createAsyncThunk(
  'videos/uploadVideo',
  async (videoData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/videos', videoData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload video');
    }
  }
);

export const updateVideo = createAsyncThunk(
  'videos/updateVideo',
  async ({ id, videoData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(`/videos/${id}`, videoData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update video');
    }
  }
);

const initialState = {
  videos: {
    items: [],
    status: 'idle',
    error: null,
    currentVideo: null,
    currentVideoStatus: 'idle',
    currentVideoError: null
  },
};

const videoSlice = createSlice({
  name: 'videos',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.videos.error = null;
      state.videos.currentVideoError = null;
    },
    setCurrentVideo: (state, action) => {
      state.videos.currentVideo = action.payload;
    },
    clearCurrentVideo: (state) => {
      state.videos.currentVideo = null;
      state.videos.currentVideoStatus = 'idle';
      state.videos.currentVideoError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Videos
      .addCase(fetchVideos.pending, (state) => {
        state.videos.status = 'loading';
        state.videos.error = null;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.videos.items = action.payload;
        state.videos.status = 'succeeded';
        state.videos.error = null;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.videos.items = [];
        state.videos.status = 'failed';
        state.videos.error = action.payload;
      })
      
      // Remove Video
      .addCase(fetchRemoveVideo.pending, (state) => {
        state.videos.status = 'loading';
        state.videos.error = null;
      })
      .addCase(fetchRemoveVideo.fulfilled, (state, action) => {
        state.videos.items = state.videos.items.filter(
          (video) => video._id !== action.payload.id
        );
        state.videos.status = 'succeeded';
        state.videos.error = null;
      })
      .addCase(fetchRemoveVideo.rejected, (state, action) => {
        state.videos.status = 'failed';
        state.videos.error = action.payload;
      })
      
      // Upload Video
      .addCase(uploadVideo.pending, (state) => {
        state.videos.currentVideoStatus = 'loading';
        state.videos.currentVideoError = null;
      })
      .addCase(uploadVideo.fulfilled, (state, action) => {
        state.videos.items.unshift(action.payload);
        state.videos.currentVideoStatus = 'succeeded';
        state.videos.currentVideoError = null;
      })
      .addCase(uploadVideo.rejected, (state, action) => {
        state.videos.currentVideoStatus = 'failed';
        state.videos.currentVideoError = action.payload;
      })
      
      // Update Video
      .addCase(updateVideo.pending, (state) => {
        state.videos.currentVideoStatus = 'loading';
        state.videos.currentVideoError = null;
      })
      .addCase(updateVideo.fulfilled, (state, action) => {
        const index = state.videos.items.findIndex(
          (video) => video._id === action.payload._id
        );
        if (index !== -1) {
          state.videos.items[index] = action.payload;
        }
        state.videos.currentVideoStatus = 'succeeded';
        state.videos.currentVideoError = null;
      })
      .addCase(updateVideo.rejected, (state, action) => {
        state.videos.currentVideoStatus = 'failed';
        state.videos.currentVideoError = action.payload;
      });
  },
});

// Action creators
export const { clearErrors, setCurrentVideo, clearCurrentVideo } = videoSlice.actions;

// Selectors
export const selectAllVideos = (state) => state.videos.videos.items;
export const selectVideoStatus = (state) => state.videos.videos.status;
export const selectVideoError = (state) => state.videos.videos.error;
export const selectCurrentVideo = (state) => state.videos.videos.currentVideo;
export const selectCurrentVideoStatus = (state) => state.videos.videos.currentVideoStatus;
export const selectCurrentVideoError = (state) => state.videos.videos.currentVideoError;

export const videoReducer = videoSlice.reducer;
