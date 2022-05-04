import { useState } from 'react';

const NewNote = ({ postNote }) => {
  const [newNote, setNewNote] = useState('');

  const createNote = async e => {
    e.preventDefault();
    postNote(newNote);
  };

  return (
    <form onSubmit={createNote}>
      <input
        value={newNote}
        onChange={e => setNewNote(e.target.value)}
        placeholder='New note...'
      />
      <button type='submit'>create</button>
    </form>
  );
};

export default NewNote;
