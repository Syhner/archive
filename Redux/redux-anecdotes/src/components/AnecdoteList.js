import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { registerVote } from '../reducers/anecdoteReducer';
import { flashNotification } from '../reducers/notificationReducer';

const AnecdoteList = () => {
  const dispatch = useDispatch();
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    const filteredAnecdotes = filter
      ? anecdotes.filter(x => x.content.toLowerCase().includes(filter))
      : anecdotes;
    return [...filteredAnecdotes].sort((a, b) => b.votes - a.votes);
  });

  const vote = (e, anecdoteId) => {
    const anecdote = e.target.parentNode.parentNode.firstChild.innerHTML;
    dispatch(registerVote(anecdoteId));
    dispatch(flashNotification(`Voted for '${anecdote}'`, 5));
  };

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={e => vote(e, anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
