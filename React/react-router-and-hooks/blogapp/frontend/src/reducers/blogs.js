import { createSlice } from '@reduxjs/toolkit';

import blogsService from '../services/blogs';

const slice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    appendBlog(state, action) {
      state.push(action.payload);
    },
    deleteBlog(state, action) {
      const index = state.findIndex(blog => blog.id === action.payload);
      state.splice(index, 1);
    },
    updateBlog(state, action) {
      return state.map(blog =>
        blog.id === action.payload.id ? action.payload : blog
      );
    },
  },
});

export const { setBlogs, appendBlog, deleteBlog, updateBlog } = slice.actions;

export const initializeBlogs = () => async dispatch => {
  const blogs = await blogsService.getAll();
  dispatch(setBlogs(blogs));
};

export const createBlog = blogToCreate => async dispatch => {
  const createdBlog = await blogsService.create(blogToCreate);
  dispatch(appendBlog(createdBlog));
  return createdBlog;
};

export const removeBlog = id => async dispatch => {
  const removedBlog = await blogsService.remove(id);
  dispatch(deleteBlog(id));
  return removedBlog;
};

export const registerLikeBlog = blogToLike => async dispatch => {
  const blogWithLike = {
    ...blogToLike,
    likes: (blogToLike.likes || 0) + 1,
    user: blogToLike.user.id,
  };

  const updatedBlog = await blogsService.update(blogWithLike.id, blogWithLike);
  dispatch(updateBlog(updatedBlog));
  return updatedBlog;
};

export const registerComment = (blogToComment, comment) => async dispatch => {
  const blogWithComment = {
    ...blogToComment,
    user: blogToComment.user.id,
    comments: blogToComment.comments.concat(comment),
  };

  const updatedBlog = await blogsService.update(
    blogToComment.id,
    blogWithComment
  );
  dispatch(updateBlog(updatedBlog));
  return updatedBlog;
};

export default slice.reducer;
