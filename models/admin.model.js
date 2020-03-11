const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String
});

module.exports = new mongoose.model('Admin', adminSchema);