import { useState, useEffect, useRef } from 'react';
import Blog from './Blog';
import Create from './Create-blog';
import Toggleable from './Toggleable';
import blogService from '../services/blogs';

const Blogs = ({ user, setNotification }) => {
  const [blogs, setBlogs] = useState([]);
  const createBlogRef = useRef();

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs));
  }, []);

  if (!user) return null;

  const resetNotification = () => {
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const createBlog = async ({ title, author, url }) => {
    createBlogRef.current.toggleVisibility();
    try {
      const newBlog = await blogService.create({ title, author, url });
      setBlogs(blogs.concat({ ...newBlog, user: { name: user.name } }));
      setNotification({
        message: `New blog: ${title} by ${author} added!`,
        type: 'success',
      });
      resetNotification();
    } catch (err) {
      setNotification({
        message: 'Failed to create blog!',
        type: 'error',
      });
      resetNotification();
    }
  };

  return (
    <div>
      <h2>blogs</h2>
      <Toggleable buttonLabel='new blog' ref={createBlogRef}>
        <Create setNotification={setNotification} createBlog={createBlog} />
      </Toggleable>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map(blog => (
          <Blog
            key={blog.id}
            blog={blog}
            blogs={blogs}
            setBlogs={setBlogs}
            user={user}
          />
        ))}
    </div>
  );
};

export default Blogs;
