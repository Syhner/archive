import { createSlice } from '@reduxjs/toolkit';

import anecdoteService from '../services/anecdotes';

const slice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    addVote(state, action) {
      const id = action.payload;
      const foundIndex = state.findIndex(x => x.id === id);
      state[foundIndex] = {
        ...state[foundIndex],
        votes: state[foundIndex].votes + 1,
      };
    },
    appendAnecdote(state, action) {
      state.push(action.payload);
    },
    setAnecdotes(state, action) {
      return action.payload;
    },
  },
});

export const { addVote, appendAnecdote, setAnecdotes } = slice.actions;

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.create(content);
    dispatch(appendAnecdote(newAnecdote));
  };
};

export const registerVote = id => {
  return async dispatch => {
    await anecdoteService.vote(id);
    dispatch(addVote(id));
  };
};

export default slice.reducer;
