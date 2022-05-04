import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { createBlog } from '../../reducers/blogs';
import { createNotification } from '../../reducers/notification';

const NewBlogForm = ({ parentRef }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = async event => {
    event.preventDefault();
    try {
      const createdBlog = await dispatch(
        createBlog({ title, author, url, likes: 0 })
      );
      setAuthor('');
      setTitle('');
      setUrl('');
      parentRef.current.toggleVisibility();
      dispatch(
        createNotification({
          message: `a new blog '${createdBlog.title}' by ${createdBlog.author} added`,
          type: 'success',
        })
      );
    } catch (err) {
      dispatch(
        createNotification({
          message: 'blog creation failed',
          type: 'danger',
        })
      );
    }
  };

  return (
    <div>
      <h3>Create new</h3>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-1" controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            id="title"
            placeholder="title of the blog"
          />
        </Form.Group>

        <Form.Group className="mb-1" controlId="author">
          <Form.Label>Author</Form.Label>
          <Form.Control
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            id="author"
            placeholder="author of the blog"
          />
        </Form.Group>

        <Form.Group className="mb-1" controlId="url">
          <Form.Label>Url</Form.Label>
          <Form.Control
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            id="url"
            placeholder="url of the blog"
          />
        </Form.Group>
        <Button
          variant="success"
          id="create-button"
          type="submit"
          style={{ marginBottom: 5, marginTop: 5 }}
        >
          create
        </Button>
      </Form>
    </div>
  );
};

export default NewBlogForm;
