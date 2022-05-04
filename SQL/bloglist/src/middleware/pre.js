const cors = require('cors');
const express = require('express');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../util/config');
const logger = require('../util/logger');
const { User } = require('../models');

const corsMiddleware = cors();
const json = express.json();

const requestLogger = (req, res, next) => {
  const { method, path, body } = req;

  logger.info(method, path, body);
  next();
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7);
  }
  next();
};

const userExtractor = async (req, res, next) => {
  const { token } = req;
  if (!token) return next();
  const decodedToken = jwt.verify(token, JWT_SECRET);
  if (!decodedToken.id) return next();
  const user = await User.findByPk(decodedToken.id);
  if (user) {
    req.user = user;
  }
  next();
};

module.exports = [
  corsMiddleware,
  json,
  requestLogger,
  tokenExtractor,
  userExtractor,
];
