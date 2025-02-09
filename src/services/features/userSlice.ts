import { TUser } from './../../utils/types';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from './../../utils/burger-api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { deleteCookie, setCookie } from '../../utils/cookie';

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async ({ email, name, password }: TRegisterData) => {
    const data = await registerUserApi({ email, name, password });
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }: TLoginData) => {
    const data = await loginUserApi({ email, password });
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (user: Partial<TRegisterData>) => {
    const data = await updateUserApi(user);
    return data.user;
  }
);

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  const data = await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
  return data.success;
});

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (_, { dispatch, getState }) => {
    const { user } = (getState() as { user: IUserState }).user;

    if (user) {
      dispatch(setIsAuthChecked(true));
    } else {
      try {
        const res = await getUserApi();
        dispatch(setUser(res.user));
      } catch (error) {
        console.error('Ошибка при проверке авторизации:', error);
      } finally {
        dispatch(setIsAuthChecked(true));
      }
    }
  }
);

interface IUserState {
  user: TUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthChecked: boolean;
}

export const initialState: IUserState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthChecked: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<TUser>): void => {
      state.user = action.payload;
    },
    setIsAuthChecked: (state, action: PayloadAction<boolean>): void => {
      state.isAuthChecked = action.payload;
    }
  },
  selectors: {
    getUserState: (state: IUserState) => state,
    getUser: (state: IUserState) => state.user,
    getIsAuthChecked: (state: IUserState) => state.isAuthChecked,
    getIsLoading: (state: IUserState) => state.isLoading,
    getError: (state: IUserState) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.error = action.error.message || 'Ошибка регистрации';
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.error = action.error.message || 'Ошибка входа';
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Ошибка обновления данных пользователя';
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthChecked = true;
        state.error = action.error.message || 'Ошибка выхода';
      });
  }
});

export const { setIsAuthChecked, setUser } = userSlice.actions;
export const {
  getUserState,
  getUser,
  getIsAuthChecked,
  getIsLoading,
  getError
} = userSlice.selectors;
