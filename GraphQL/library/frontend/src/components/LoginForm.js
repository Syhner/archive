import { useState } from 'react';
import { useMutation } from '@apollo/client';

import { LOGIN } from '../queries';

const LoginForm = ({ setToken, notify, show, setPage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [login, result] = useMutation(LOGIN, {
    onError: error => {
      notify({ message: error.graphQLErrors[0].message, type: 'error' });
    },
  });

  if (!show) {
    return null;
  }

  const submit = async event => {
    event.preventDefault();

    await login({ variables: { username, password } });

    if (result.data) {
      const token = result.data.login.value;
      localStorage.setItem('library-user-token', token);
      setToken(token);
      notify({ message: 'logged in', type: 'success' });
      setPage(null);
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={submit}>
        <div>
          username{' '}
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password{' '}
          <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  );
};

export default LoginForm;
