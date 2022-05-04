import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';

import { createNotification } from '../reducers/notification';
import { setUser } from '../reducers/user';

const LoggedUser = () => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const logout = () => {
    dispatch(setUser(null));
    dispatch(createNotification({ message: 'good bye!', type: 'success' }));
  };

  if (!user) return null;

  return (
    <>
      {user.name} logged in{' '}
      <Button variant="secondary" onClick={logout}>
        logout
      </Button>
    </>
  );
};

export default LoggedUser;
