const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  client: {
    name: String,
    email: String,
    phone: Number
  },
  message: String,
  jobType: String,
  seen: Boolean,
  date: Date
});

module.exports = new mongoose.model('Message', messageSchema);