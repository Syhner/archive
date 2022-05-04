import { useQuery } from '@apollo/client';
import { useState } from 'react';

import { ALL_BOOKS } from '../queries';

const Books = props => {
  const [genre, setGenre] = useState('all genres');
  const books = useQuery(ALL_BOOKS, {
    variables: { genre: genre === 'all genres' ? null : genre },
  });

  if (!props.show) {
    return null;
  }

  if (books.loading) {
    return <div>loading...</div>;
  }

  const selectChange = e => {
    setGenre(e.target.value);
  };

  return (
    <div>
      <h2>books</h2>
      filter by genre{' '}
      <select value={genre} onChange={selectChange}>
        <option value='all genres'>all genres</option>
        <option value='agile'>agile</option>
        <option value='classic'>classic</option>
        <option value='crime'>crime</option>
        <option value='design'>design</option>
        <option value='patterns'>patterns</option>
        <option value='refactoring'>refactoring</option>
        <option value='revolution'>revolution</option>
      </select>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.data.allBooks.map(a => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
