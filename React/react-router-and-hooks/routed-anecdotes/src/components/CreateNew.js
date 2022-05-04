import React from 'react';

import { useField } from '../hooks';

export const CreateNew = props => {
  const content = useField('text');
  const author = useField('text');
  const info = useField('text');

  const handleSubmit = e => {
    e.preventDefault();
    props.addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0,
    });
  };

  const reset = e => {
    e.preventDefault();
    [content, author, info].forEach(field =>
      field.onChange({ target: { value: '' } })
    );
  };

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content} />
        </div>
        <div>
          author
          <input {...author} />
        </div>
        <div>
          url for more info
          <input {...info} />
        </div>
        <button>create</button>
        <button onClick={reset}>reset</button>
      </form>
    </div>
  );
};
