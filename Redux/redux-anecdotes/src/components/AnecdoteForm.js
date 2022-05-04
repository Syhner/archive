import React from 'react';
import { connect } from 'react-redux';

import { createAnecdote } from '../reducers/anecdoteReducer';
import { flashNotification } from '../reducers/notificationReducer';

const AnecdoteForm = props => {
  const newAnecdote = async e => {
    const anecdoteContent = e.target.anecdote.value;
    e.preventDefault();
    e.target.anecdote.value = '';
    props.createAnecdote(anecdoteContent);
    props.flashNotification(`Anecdote created '${anecdoteContent}'`, 5);
  };

  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={newAnecdote}>
        <div>
          <input name='anecdote' />
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  );
};

const mapDispatchToProps = { createAnecdote, flashNotification };

const connectedAnecdoteForm = connect(null, mapDispatchToProps)(AnecdoteForm);
export default connectedAnecdoteForm;
