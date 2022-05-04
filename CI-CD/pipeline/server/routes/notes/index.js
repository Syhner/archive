const router = require('express').Router();
const { v4: uuid } = require('uuid');

const ApiError = require('../../util/ApiError');

const notes = [];

router.get('/', (req, res) => {
  res.send(notes);
});

router.post('/', (req, res) => {
  const { note } = req.body;

  if (!note) {
    throw new ApiError(400, 'Note is required');
  }

  const newNote = { id: uuid(), note };
  notes.push(newNote);

  res.send(newNote);
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const index = notes.findIndex(note => note.id === id);
  const noteToDelete = notes[index];

  if (!noteToDelete) {
    throw new ApiError(404, `A note with id ${id} does not exist`);
  }

  notes.splice(index, 1);

  res.send(noteToDelete);
});

module.exports = router;
