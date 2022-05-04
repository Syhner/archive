import { useQuery } from '@apollo/client';

import { ALL_BOOKS, MY_FAVORITE_GENRE } from '../queries';

const Recommendations = props => {
  const books = useQuery(ALL_BOOKS, { variables: { genre: null } });
  const favGenre = useQuery(MY_FAVORITE_GENRE);

  if (!props.show) {
    return null;
  }

  if (books.loading || favGenre.loading) {
    return <div>loading...</div>;
  }

  const genre = favGenre.data.me.favoriteGenre;

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre <b>{genre}</b>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.data.allBooks
            .filter(book => book.genres.includes(genre))
            .map(a => (
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

export default Recommendations;
