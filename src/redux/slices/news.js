import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/utils/axios';
import { apiErrorMessage } from '@/utils/apiError';
import { STATUS } from '../status';

const initialState = {
  items: [],
  status: STATUS.IDLE,
  error: null,
};

export const getNews = createAsyncThunk('news/getNews', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get('/news');
    return data;
  } catch (error) {
    return rejectWithValue(apiErrorMessage(error, 'Failed to fetch news'));
  }
});

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getNews.pending, state => {
        state.status = STATUS.LOADING;
        state.error = null;
      })
      .addCase(getNews.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = STATUS.SUCCEEDED;
        state.error = null;
      })
      .addCase(getNews.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.error = action.payload;
      });
  },
});

export const selectNews = state => state.news.items;
export const selectNewsStatus = state => state.news.status;
export const selectNewsError = state => state.news.error;

export const newsReducer = newsSlice.reducer;
