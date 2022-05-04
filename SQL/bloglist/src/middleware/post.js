const logger = require('../util/logger');

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (err, req, res, next) => {
  logger.error(err);

  const { name } = err;
  if (name === 'CastError') {
    return res.status(400).json({ error: 'malformed id' });
  } else if (name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  } else if (name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid token' });
  } else if (name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired' });
  } else if (name === 'SequelizeValidationError') {
    return res.status(400).json({ error: err.errors.map(e => e.message) });
  } else if (name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ error: err.errors.map(e => e.message) });
  } else if (name === 'SequelizeDatabaseError') {
    return res.status(400).json({ error: 'Bad request' });
  }

  next(err);
};

module.exports = [unknownEndpoint, errorHandler];
