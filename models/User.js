const mongoose =  require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("config");

// User Schema:
const  UserSchema =  mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    minlength: 2, 
    match: /^[A-Za-z][A-Za-z0-9 ]*[A-Za-z0-9]$/ // No space at beginning or end
  }, 

  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: /\S+@\S+\.\S+/ 
  },

  password: {
    type: String,
    required: true
  },

  register_date: {
    type: Date,
    default: Date.now
}
});

const User = module.exports = mongoose.model("User", UserSchema);