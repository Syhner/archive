import { useState, useEffect } from 'react';

import Notes from './Notes';
import NewNote from './NewNote';
import { getNotes, postNote, deleteNote } from '../services/notes';

const App = () => {
  const [notes, setNotes] = useState([]);

  const handleGetNotes = async () => {
    const allNotes = await getNotes();
    setNotes(allNotes);
  };

  const handlePostNote = async newNote => {
    await postNote(newNote);
    handleGetNotes();
  };

  const handleDeleteNote = async noteToDelete => {
    await deleteNote(noteToDelete);
    handleGetNotes();
  };

  useEffect(() => {
    handleGetNotes();
  }, []);

  return (
    <div>
      <h1>Note app</h1>
      <NewNote postNote={handlePostNote} />
      <Notes notes={notes} deleteNote={handleDeleteNote} />
    </div>
  );
};

export default App;
