// const mongoose = require('mongoose');

// // create schema for users model
// const userSchema = new mongoose.Schema({
//     name:{
//         type: String,
//         required: true
//     },
//     email:{
//         type: String,
//         required: true,
//         unique: true
//     },
//     password:{
//         type: String,
//         required: true
//     },
//     date:{
//         type: Date,
//         default: Date.now
//     }
// });

// module.exports = mongoose.model('user',userSchema);
const mongoose = require("mongoose");

// Create schema for notes model
const noteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    default: "General",
  },
  audio: {
    type: String, // Store the file path or URL
    default: null,
  },
  images: [{
    type: String, // Store the file paths or URLs
  }],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Note", noteSchema);