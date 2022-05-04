import React, { useState, useEffect } from 'react';
import Blogs from './components/Blogs';
import Notification from './components/Notification';
import Login from './components/Login';
import User from './components/User';
import blogsService from './services/blogs';

const App = () => {
  const [notification, setNotification] = useState({
    message: null,
    type: null,
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogsService.setToken(user.token);
    }
  }, []);

  return (
    <div>
      <Notification notification={notification} />
      <Login setNotification={setNotification} user={user} setUser={setUser} />
      <User user={user} setUser={setUser} />
      <Blogs user={user} setNotification={setNotification} />
    </div>
  );
};

export default App;
