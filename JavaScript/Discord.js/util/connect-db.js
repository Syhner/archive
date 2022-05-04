const mongoose = require('mongoose');
const { mongoUri } = require('../config');

const main = async () => {
  try {
    await mongoose.connect(mongoUri, { keepAlive: true });
    console.log('Connected to MongoDB!');
  } catch (err) {
    console.error('Failed connection to MongoDB', err);
  }
};

main();
