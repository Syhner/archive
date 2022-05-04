const mongoose = require('mongoose');

const { MONGO_URI } = require('./config');

console.log('Connecting to MongoDB...');

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.error('Error connecting to MongoDB!', err.message));
