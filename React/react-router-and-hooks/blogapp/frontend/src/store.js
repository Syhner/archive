import { configureStore } from '@reduxjs/toolkit';

import notification from './reducers/notification';
import blogs from './reducers/blogs';
import user from './reducers/user';

export default configureStore({
  reducer: { notification, blogs, user },
});
