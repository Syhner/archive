import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'notification',
  initialState: { message: null, invokedAt: null },
  reducers: {
    setNotification(state, action) {
      return action.payload;
    },
    clearNotification(state, action) {
      // Only clear if it's the most recent notification
      if (action.payload === state.invokedAt) {
        return { message: null };
      }
    },
  },
});

export const { setNotification, clearNotification } = slice.actions;

export const flashNotification = (message, seconds) => {
  return async dispatch => {
    const invokedAt = Date.now();
    dispatch(setNotification({ message, invokedAt }));
    setTimeout(() => {
      dispatch(clearNotification(invokedAt));
    }, seconds * 1000);
  };
};

export default slice.reducer;
