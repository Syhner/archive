import { useState } from 'react';
import { useApolloClient, useSubscription } from '@apollo/client';

import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import Recommendations from './components/Recommendations';
import { BOOK_ADDED, ALL_BOOKS } from './queries';

const App = () => {
  const [page, setPage] = useState(null);
  const [token, setToken] = useState(
    window.localStorage.getItem('library-user-token')
  );
  const [notification, setNotification] = useState({
    message: null,
    type: null,
  });
  const client = useApolloClient();

  const notify = ({ message, type }) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: null });
    }, 5000);
  };

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      notify({
        message: `A book '${subscriptionData.data.bookAdded.title}' has been added!`,
        type: 'success',
      });
      client.cache.updateQuery(
        { query: ALL_BOOKS, variables: { genre: null } },
        ({ allBooks }) => {
          return {
            allBooks: allBooks.concat(subscriptionData.data.bookAdded),
          };
        }
      );
    },
  });

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
    setPage(null);
    notify({ message: 'logged out', type: 'success' });
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {!token && <button onClick={() => setPage('login')}>login</button>}
        {token && <button onClick={() => setPage('add')}>add book</button>}
        {token && (
          <button onClick={() => setPage('recommend')}>recommend</button>
        )}
        {token && <button onClick={logout}>logout</button>}
      </div>

      <Notification notification={notification} />

      <LoginForm
        setToken={setToken}
        notify={notify}
        show={page === 'login'}
        setPage={setPage}
      />

      <Authors show={page === 'authors' || page === null} token={token} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />

      <Recommendations show={page === 'recommend'} />
    </div>
  );
};

export default App;
