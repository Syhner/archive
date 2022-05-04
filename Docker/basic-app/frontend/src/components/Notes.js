import Note from './Note';

const Notes = ({ notes, deleteNote }) => {
  return (
    <ul>
      {notes.map(note => (
        <Note key={note.id} note={note} deleteNote={deleteNote} />
      ))}
    </ul>
  );
};

export default Notes;
