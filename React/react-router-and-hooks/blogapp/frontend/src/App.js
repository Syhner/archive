import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import LoginForm from './components/LoginForm';
import LoggedUser from './components/LoggedUser';
import Notification from './components/Notification';
import Home from './components/Home';
import Users from './components/Users';
import Blogs from './components/Blogs';

import { initializeBlogs } from './reducers/blogs';
import { getAndSetUser } from './reducers/user';

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initializeBlogs());
    dispatch(getAndSetUser());
  }, [dispatch]);

  const user = useSelector(state => state.user);

  if (user === null) {
    return (
      <>
        <Notification />
        <LoginForm />
      </>
    );
  }

  return (
    <>
      <Navbar>
        <Navbar.Brand>
          <img
            src="/logo512.png"
            width="40"
            height="40"
            className="d-inline-block align-center"
          />
          <Link
            style={{
              padding: 10,
              textDecoration: 'none',
            }}
            to="/"
          >
            Blogs
          </Link>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav>
            <Nav.Link>
              <Link
                style={{
                  padding: 10,
                  textDecoration: 'none',
                }}
                to="/users"
              >
                Users
              </Link>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <LoggedUser />

      <Notification />

      <h2 style={{ fontWeight: 'bolder', letterSpacing: 5 }}>Blogs</h2>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<Users />} />
        <Route path="/blogs/:id" element={<Blogs />} />
      </Routes>
    </>
  );
};

export default App;
