const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  client: {
    name: String,
    email: String,
    phone: Number
  },
  total: String,
  items: [{ name: String, total: Number }],
  paid: Boolean,
  dueDate: Date,
  dateSent: Date,
  datePaid: Date
});

module.exports = new mongoose.model('Invoice', invoiceSchema);