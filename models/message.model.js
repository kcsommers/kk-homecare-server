const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: Number,
  message: String,
  jobType: String,
  replied: Boolean,
  date: Date
});

module.exports = new mongoose.model('Message', messageSchema);