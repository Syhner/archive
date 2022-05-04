import { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

import {
  removeBlog as removeBlogReducer,
  registerLikeBlog,
} from '../../reducers/blogs';
import { createNotification } from '../../reducers/notification';

const BlogDetails = ({ blog, visible, likeBlog, removeBlog, own }) => {
  if (!visible) return null;

  const addedBy = blog.user && blog.user.name ? blog.user.name : 'anonymous';

  return (
    <div>
      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div>
        {blog.likes} likes{' '}
        <Button variant="success" onClick={() => likeBlog(blog.id)}>
          like
        </Button>
      </div>
      {addedBy}
      {own && (
        <Button variant="danger" onClick={() => removeBlog(blog.id)}>
          remove
        </Button>
      )}
    </div>
  );
};

const Blog = ({ blog }) => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  const removeBlog = () => {
    if (!window.confirm(`remove '${blog.title}' by ${blog.author}?`)) return;
    dispatch(removeBlogReducer(blog.id));
  };

  const likeBlog = async () => {
    await dispatch(registerLikeBlog(blog));
    dispatch(
      createNotification({
        message: `you liked '${blog.title}' by ${blog.author}`,
        type: 'success',
      })
    );
  };

  const style = {
    padding: 3,
    margin: 5,
    borderStyle: 'solid',
    borderWidth: 1,
  };

  return (
    <div style={style} className="blog">
      <Link to={`/blogs/${blog.id}`}>
        {blog.title} - {blog.author}
      </Link>
      <button onClick={() => setVisible(!visible)}>
        {visible ? 'hide' : 'view'}
      </button>
      <BlogDetails
        blog={blog}
        visible={visible}
        likeBlog={likeBlog}
        removeBlog={removeBlog}
        own={blog.user && user.username === blog.user.username}
      />
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
  }).isRequired,
};

export default Blog;
