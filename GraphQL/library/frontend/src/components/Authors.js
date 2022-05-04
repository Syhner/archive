import { useQuery, useMutation } from '@apollo/client';
import { useState } from 'react';

import { ALL_AUTHORS, UPDATE_BORN } from '../queries';

const Authors = props => {
  const authors = useQuery(ALL_AUTHORS);
  const [updateBorn] = useMutation(UPDATE_BORN, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });
  const [name, setName] = useState('');
  const [born, setBorn] = useState('');

  if (!props.show) {
    return null;
  }

  if (authors.loading) {
    return <div>loading...</div>;
  }
  const { allAuthors } = authors.data;

  const submit = e => {
    e.preventDefault();

    const selectName = name === '' ? allAuthors[0].name : name;

    updateBorn({
      variables: { name: selectName, born: parseInt(born) },
    });

    setName('');
    setBorn('');
  };

  const selectChange = e => {
    setName(e.target.value);
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {allAuthors.map(a => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {props.token && (
        <div>
          <h2>Set birthyear</h2>
          <form onSubmit={submit}>
            <div>
              name
              <select value={name} onChange={selectChange}>
                {allAuthors.map(a => (
                  <option key={a.name} value={a.name}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              born
              <input
                value={born}
                onChange={({ target }) => setBorn(target.value)}
              />
            </div>
            <button type='submit'>update author</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Authors;
