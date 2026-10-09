import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import axios from '@/utils/axios';
import { STATUS } from '../status';

const TOKEN_KEY = 'token';

const hasToken = () => Boolean(window.localStorage.getItem(TOKEN_KEY));

const persistToken = data => {
  if (data && 'token' in data) {
    window.localStorage.setItem(TOKEN_KEY, data.token);
  }
  return data;
};

export const registerUser = createAsyncThunk('auth/registerUser', async params => {
  const { data } = await axios.post('/auth/register', params);
  return persistToken(data);
});

export const loginUser = createAsyncThunk('auth/loginUser', async params => {
  const { data } = await axios.post('/auth/login', params);
  return persistToken(data);
});

export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async () => {
    const { data } = await axios.get('/auth/user');
    return data;
  },
  {
    // Skip the request entirely when there is no token to authenticate with.
    condition: hasToken,
  }
);

const initialState = {
  data: null,
  // With a stored token the user is fetched on startup, so start in 'loading'
  // to keep route guards from redirecting before fetchUser settles.
  status: hasToken() ? STATUS.LOADING : STATUS.IDLE,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.data = null;
      state.status = STATUS.IDLE;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUser.pending, state => {
        state.status = STATUS.LOADING;
      })
      .addMatcher(isAnyOf(registerUser.pending, loginUser.pending), state => {
        state.status = STATUS.LOADING;
        state.data = null;
      })
      .addMatcher(
        isAnyOf(registerUser.fulfilled, loginUser.fulfilled, fetchUser.fulfilled),
        (state, action) => {
          state.status = STATUS.SUCCEEDED;
          state.data = action.payload;
        }
      )
      .addMatcher(isAnyOf(registerUser.rejected, loginUser.rejected, fetchUser.rejected), state => {
        state.status = STATUS.FAILED;
        state.data = null;
      });
  },
});

export const logoutUser = () => dispatch => {
  window.localStorage.removeItem(TOKEN_KEY);
  dispatch(authSlice.actions.logout());
};

export const selectAuthData = state => state.auth.data;
export const selectAuthStatus = state => state.auth.status;
export const selectIsAuth = state => Boolean(state.auth.data);
export const selectIsAuthPending = state => state.auth.status === STATUS.LOADING;

export const authReducer = authSlice.reducer;
