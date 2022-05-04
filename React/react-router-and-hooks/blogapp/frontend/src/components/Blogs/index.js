import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { registerLikeBlog, registerComment } from '../../reducers/blogs';
import { createNotification } from '../../reducers/notification';

const Blogs = () => {
  const [comment, setComment] = useState('');
  const dispatch = useDispatch();
  const id = useParams().id;
  const blogs = useSelector(state => state.blogs);
  const blog = blogs.find(b => b.id === id);

  if (!blog) return <h2>Blog not found!</h2>;

  const likeBlog = async () => {
    await dispatch(registerLikeBlog(blog));
    dispatch(
      createNotification({
        message: `you liked '${blog.title}' by ${blog.author}`,
        type: 'success',
      })
    );
  };

  const submitComment = async event => {
    event.preventDefault();
    await dispatch(registerComment(blog, comment));
    dispatch(
      createNotification({
        message: 'comment posted!',
        type: 'success',
      })
    );
    setComment('');
  };

  return (
    <div>
      <h2>
        {blog.title} - {blog.author}{' '}
      </h2>
      <li>
        <a href={blog.url}>{blog.url}</a>
      </li>
      <li>
        {blog.likes} likes{' '}
        <button onClick={() => likeBlog(blog.id)}>like</button>
      </li>
      <li>added by {blog.user.name}</li>
      <h2>comments</h2>
      <form onSubmit={submitComment}>
        <input
          value={comment}
          onChange={({ target }) => setComment(target.value)}
          id="comment"
          placeholder="post a comment"
        />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {blog.comments.map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>
    </div>
  );
};

export default Blogs;
