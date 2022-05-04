const mongoose = require('mongoose');

const reqString = {
  type: String,
  required: true,
};

const schema = new mongoose.Schema({
  // Guild id
  _id: reqString,
  channelId: reqString,
  message: reqString,
  notify: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model('welcome', schema);
