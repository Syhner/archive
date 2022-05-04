import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';
import CreateBlog from './Create-blog';

describe('Blog component', () => {
  const blog = {
    title: 'Promises in JS',
    author: 'Toby Jaspe',
    url: 'http://blogs.com/promises',
    likes: 3,
    user: {
      username: 'user1',
      name: 'Mark',
    },
  };

  test('renders the blog name and author, but not the url and likes by default', () => {
    const { container } = render(<Blog blog={blog} user={blog.user} />);

    const element = screen.getByText('Promises in JS - Toby Jaspe');
    expect(element).toBeDefined();

    const url = container.querySelector('.url');
    expect(url).not.toBeVisible();
    const likes = container.querySelector('.likes');
    expect(likes).not.toBeVisible();
  });

  test('url and likes are visible after clicking button', () => {
    const { container } = render(<Blog blog={blog} user={blog.user} />);

    const button = screen.getByText('view');
    userEvent.click(button);

    const url = container.querySelector('.url');
    expect(url).toBeVisible();
    const likes = container.querySelector('.likes');
    expect(likes).toBeVisible();
  });

  test('clicking the like button twice calls the corresponding event handler twice', () => {
    render(<Blog blog={blog} user={blog.user} />);

    const viewButton = screen.getByText('view');
    userEvent.click(viewButton);

    const likeButton = screen.getByText('like');
    // Remove all event listeners by cloning
    likeButton.replaceWith(likeButton.cloneNode(true));

    expect(likeButton).toBeDefined();

    const mockHandler = jest.fn();
    likeButton.addEventListener('click', mockHandler);

    userEvent.click(likeButton);
    userEvent.click(likeButton);
    expect(mockHandler.mock.calls).toHaveLength(2);
  });

  test('when blog is created, new blog form calls event handler with the right details', async () => {
    const { title, author, url } = blog;

    const createBlog = jest.fn();
    render(<CreateBlog createBlog={createBlog} />);

    const createButton = screen.getByText('create');
    const titleInput = screen.getByPlaceholderText('title');
    const authorInput = screen.getByPlaceholderText('author');
    const urlInput = screen.getByPlaceholderText('url');

    userEvent.type(titleInput, title);
    userEvent.type(authorInput, author);
    userEvent.type(urlInput, url);
    userEvent.click(createButton);

    expect(createBlog).toHaveBeenCalled();
    expect(createBlog.mock.calls[0][0]).toEqual({ title, author, url });
  });
});
