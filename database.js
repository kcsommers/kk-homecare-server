require('dotenv').config();
const mongoose = require('mongoose');

class Database {
  constructor() {
    this._connect();
  }

  _connect() {
    //Set up default mongoose connection
    mongoose.connect(
      process.env.MONGODB_URI,
      { useNewUrlParser: true }
    )
      .then(() => console.log('DB Connected'))
      .catch(err => console.error(err));

    //Get the default connection
    const db = mongoose.connection;

    //Bind connection to error event (to get notification of connection errors)
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  }
}

module.exports = new Database();