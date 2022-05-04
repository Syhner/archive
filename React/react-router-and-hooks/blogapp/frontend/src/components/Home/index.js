import React from 'react';
import { useRef } from 'react';
import { useSelector } from 'react-redux';

import Blogs from './Blogs';
import NewBlogForm from './NewBlogForm';
import Togglable from '../Togglable';

const Home = () => {
  const blogs = useSelector(state => state.blogs);
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  const blogFormRef = useRef();

  return (
    <div>
      <Togglable buttonLabel="create new" ref={blogFormRef}>
        <NewBlogForm parentRef={blogFormRef} />
      </Togglable>

      <Blogs blogs={sortedBlogs} />
    </div>
  );
};

export default Home;
