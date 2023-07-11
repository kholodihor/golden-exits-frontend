import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/utils/axios';

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (params) => {
    const { data } = await axios.post('/auth/register', params);
    return data;
  }
);

export const loginUser = createAsyncThunk('auth/loginUser', async (params) => {
  const { data } = await axios.post('/auth/login', params);
  return data;
});

export const fetchUser = createAsyncThunk('auth/fetchUser', async () => {
  const { data } = await axios.get('/auth/user');
  return data;
});

const initialState = {
  data: null,
  status: 'loading',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.data = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'loaded';
        state.data = action.payload;
      })
      .addCase(registerUser.rejected, (state) => {
        state.status = 'error';
        state.data = null;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.data = null;
      })
      .addCase(loginUser.fulfilled, (state,action) => {
        state.status = 'loaded';
        state.data = action.payload;
      })
      .addCase(loginUser.rejected, (state) => {
        state.status = 'error';
        state.data = null;
      })
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading';
        state.data = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'loaded';
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.status = 'error';
        state.data = null;
      });
  },
});

export const selectIsAuth = (state) => Boolean(state.auth.data);

export const authReducer = authSlice.reducer;

export const { logout } = authSlice.actions;
