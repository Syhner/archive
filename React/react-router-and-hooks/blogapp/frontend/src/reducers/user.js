import { createSlice } from '@reduxjs/toolkit';

import loginService from '../services/login';
import userService from '../services/user';

const slice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      const user = action.payload;
      if (user) {
        userService.setUser(user);
        return user;
      }
      if (!user) {
        userService.clearUser();
        return null;
      }
    },
    clearUser() {
      return null;
    },
    getAndSetUser() {
      const userFromStorage = userService.getUser();
      if (userFromStorage) {
        return userFromStorage;
      }
    },
  },
});

export const { setUser, setToken, clearUser, getAndSetUser } = slice.actions;

export const login = credentials => async dispatch => {
  const user = await loginService.login(credentials);
  dispatch(setUser(user));
  return user;
};

export default slice.reducer;
