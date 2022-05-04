const express = require('express');
require('dotenv').config();

const routes = require('./util/routes');
const errorHandler = require('./middleware/app/errorHandler');

const app = express();

app.use(express.static('../client/build'));
app.use(express.json());

app.use('/api', routes);

app.get('/health', (req, res) => {
  res.send('ok');
});

app.use(errorHandler);

module.exports = app;
