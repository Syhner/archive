import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Todo from './Todo';

describe('<Todo />', () => {
  test('Renders todo', () => {
    const todo = {
      _id: '6236e6f3cbd7c4a6100af39c',
      done: true,
      text: 'Learn about containers',
    };
    const onClickDelete = jest.fn();
    const onClickComplete = jest.fn();

    render(
      <Todo
        todo={todo}
        onClickDelete={onClickDelete}
        onClickComplete={onClickComplete}
      />
    );

    const element = screen.getByText('Learn about containers');
    expect(element).toBeDefined();
  });

  test('After clicking delete button, calls delete handler', async () => {
    const todo = {
      _id: '6236e6f3cbd7c4a6100af39c',
      done: true,
      text: 'Learn about containers',
    };
    const onClickDelete = jest.fn();
    const onClickComplete = jest.fn();

    render(
      <Todo
        todo={todo}
        onClickDelete={onClickDelete}
        onClickComplete={onClickComplete}
      />
    );

    const deleteButton = screen.getByText('Delete');
    userEvent.click(deleteButton);

    expect(onClickDelete).toHaveBeenCalled();
  });

  test('After marking todo as done, calls complete handler', () => {
    const todo = {
      _id: '6236e6f3cbd7c4a6100af39c',
      done: false,
      text: 'Learn about containers',
    };
    const onClickDelete = jest.fn();
    const onClickComplete = jest.fn();

    render(
      <Todo
        todo={todo}
        onClickDelete={onClickDelete}
        onClickComplete={onClickComplete}
      />
    );

    const completeButton = screen.getByText('Set as done');
    userEvent.click(completeButton);

    expect(onClickComplete).toHaveBeenCalled();
  });
});
