import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/utils/axios';

export const fetchVideos = createAsyncThunk('videos/fetchVideos', async () => {
  const { data } = await axios.get('/videos');
  return data;
});

export const fetchRemoveVideo = createAsyncThunk(
  'videos/fetchRemoveVideo',
  async (id) => axios.delete(`/videos/${id}`)
);

const initialState = {
  videos: {
    items: [],
    status: 'loading',
  },
};

const videoSlice = createSlice({
  name: 'videos',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchVideos.pending]: (state) => {
      state.videos.items = [];
      state.videos.status = 'loading';
    },
    [fetchVideos.fulfilled]: (state, action) => {
      state.videos.items = action.payload;
      state.videos.status = 'loaded';
    },
    [fetchVideos.rejected]: (state) => {
      state.videos.items = [];
      state.videos.status = 'error';
    },
  },
});

export const videoReducer = videoSlice.reducer;
