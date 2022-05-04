import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';

import userService from '../../services/user';

const Users = () => {
  const [users, setUsers] = useState([]);
  const id = useParams().id;

  useEffect(async () => {
    const users = await userService.getAll();
    setUsers(users);
  }, []);

  const foundUser = users.find(u => u.id === id);

  if (id && foundUser) {
    return (
      <div>
        <h3>{foundUser.name}</h3>
        <h5>Added blogs:</h5>
        <ul>
          {foundUser.blogs.map(blog => (
            <li key={blog.id}>{blog.title}</li>
          ))}
        </ul>
      </div>
    );
  }

  if (id && !foundUser) {
    return <h2>User not found!</h2>;
  }

  return (
    <div>
      <h2>Users</h2>
      <Table striped>
        <thead>
          <tr>
            <th>Name</th>
            <th>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>
                <Link to={`/users/${u.id}`}>{u.name}</Link>
              </td>
              <td>{u.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Users;
