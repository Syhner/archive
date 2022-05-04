const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('./db');
const personsService = require('./services/persons');

morgan.token('post-body', function (req, res) {
  if (req.method === 'POST' || req.method === 'PUT') {
    return JSON.stringify(req.body);
  }
  return '';
});

const app = express();

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :post-body'
  )
);

app.get('/info', (req, res, next) => {
  const date = new Date();
  personsService
    .getAll()
    .then(({ length }) => {
      const output = `Phonebook has info for ${length.toString()} people<br/>${date}`;
      res.send(output);
    })
    .catch(err => next(err));
});

app.get('/api/persons', (req, res, next) => {
  personsService
    .getAll()
    .then(allPersons => res.json(allPersons))
    .catch(err => next(err));
});

app.get('/api/persons/:id', (req, res, next) => {
  personsService
    .getById(req.params.id)
    .then(person => {
      if (person) {
        return res.json(person);
      }
      return res.status(404).end();
    })
    .catch(err => next(err));
});

app.post('/api/persons', (req, res, next) => {
  personsService
    .create(req.body)
    .then(person => {
      res.status(201).json(person);
    })
    .catch(err => next(err));
});

app.put('/api/persons/:id', (req, res, next) => {
  personsService
    .update(req.params.id, req.body.number)
    .then(person => {
      if (person) {
        return res.json(person);
      } else {
        return res.status(404).end();
      }
    })
    .catch(err => next(err));
});

app.delete('/api/persons/:id', (req, res, next) => {
  personsService
    .remove(req.params.id)
    .then(person => {
      if (person) {
        return res.status(204).end();
      } else {
        return res.status(404).end();
      }
    })
    .catch(err => next(err));
});

app.use((err, req, res, next) => {
  console.error(err);

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'malformed id' });
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  } else if (err.name === 'DuplicateNameError') {
    return res.status(409).json({ message: 'duplicate name' });
  }
  next(err);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
