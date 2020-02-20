const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: String,
  tag: String
});

module.exports = new mongoose.model('Image', imageSchema);


// let validator = require('validator')

// let emailSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//     validate: (value) => {
//       return validator.isEmail(value)
//     }
//   }
// })

// module.exports = mongoose.model('Email', emailSchema)