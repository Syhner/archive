import React from 'react';
import Toggleable from './Toggleable';
import './Blog.css';
import blogsService from '../services/blogs';

const Blog = ({ blog, blogs, setBlogs, user }) => {
  const incrementLikes = async () => {
    try {
      await blogsService.update(blog.id, { likes: blog.likes + 1 });
      setBlogs(
        blogs.map(item => {
          if (item.id === blog.id) {
            item.likes++;
          }
          return item;
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}?`))
        return;
      await blogsService.remove(blog.id);
      setBlogs(blogs.filter(item => item.id !== blog.id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='blog'>
      {blog.title} - {blog.author}
      <Toggleable buttonLabel='view'>
        <li className='url'>{blog.url}</li>
        <li className='likes'>
          likes {blog.likes || 0}{' '}
          {blog.user.name === user.name && (
            <button onClick={incrementLikes}>like</button>
          )}
        </li>
        {blog.user.name === user.name && (
          <button onClick={handleDelete}>delete</button>
        )}
      </Toggleable>
    </div>
  );
};

export default Blog;
