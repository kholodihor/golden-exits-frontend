import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/utils/axios';

const initialState = {
  news: {
    items: [],
    status: 'idle',
    error: null,
  },
};

export const getNews = createAsyncThunk('news/getNews', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get('/news');
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch news');
  }
});

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getNews.pending, state => {
        state.news.status = 'loading';
        state.news.error = null;
      })
      .addCase(getNews.fulfilled, (state, action) => {
        state.news.items = action.payload;
        state.news.status = 'succeeded';
        state.news.error = null;
      })
      .addCase(getNews.rejected, (state, action) => {
        state.news.status = 'failed';
        state.news.error = action.payload;
      });
  },
});

export const newsReducer = newsSlice.reducer;
