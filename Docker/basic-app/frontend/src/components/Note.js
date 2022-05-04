const Note = ({ note, deleteNote }) => {
  const handleDelete = async () => {
    await deleteNote(note);
  };

  return (
    <li>
      {note.note} <button onClick={handleDelete}>delete</button>
    </li>
  );
};

export default Note;
