import { useState } from 'react';
import loginService from '../services/login';
import blogsService from '../services/blogs';

const Login = ({ setNotification, user, setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  if (user) return null;

  const resetNotification = () => {
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleLogin = async event => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem('loggedUser', JSON.stringify(user));
      blogsService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
      setNotification({ message: 'Logged in!', type: 'success' });
      resetNotification();
    } catch (err) {
      setNotification({ message: 'Wrong credentials', type: 'error' });
      resetNotification();
    }
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          id='username'
          type='text'
          value={username}
          name='Username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id='password'
          type='password'
          value={password}
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button id='login-button' type='submit'>
        login
      </button>
    </form>
  );

  return <> {loginForm()}</>;
};

export default Login;
