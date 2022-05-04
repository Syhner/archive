const mongoose = require('mongoose');
require('dotenv').config();

console.log('Connecting to MongoDB...');

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch(err => {
    console.log('Error connecting to MongoDB!', err.message);
  });
