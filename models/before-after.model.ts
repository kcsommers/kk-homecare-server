const mongoose = require('mongoose');

const beforeAfterSchema = new mongoose.Schema({
  beforeUrl: String,
  afterUrl: String
});

module.exports = new mongoose.model('BeforeAfter', beforeAfterSchema);