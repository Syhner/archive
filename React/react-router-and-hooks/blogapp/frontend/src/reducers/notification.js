import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'notification',
  initialState: { message: null, type: 'info' },
  reducers: {
    setNotification(state, action) {
      const { message, type } = action.payload;
      return { message, type };
    },
  },
});

export const { setNotification } = slice.actions;

let timeoutId = null;

export const createNotification = ({
  message,
  type = 'success',
  duration = 5,
}) => {
  return dispatch => {
    dispatch(setNotification({ message, type }));

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      dispatch(setNotification({ message: null }));
    }, duration * 1000);
  };
};

export default slice.reducer;
