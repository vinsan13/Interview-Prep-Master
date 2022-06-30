const mongoose = require("mongoose");



const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "please enter an email"],
    unique: [true, "Email is already registered"],
    lowercase: true,
   
  },
  username: {
    type: String,
    unique: [true, "Username already exists"],
    minlength: [4, " Username too small"],
    required: [true, "Enter a username"],
  },
  password: {
    type: String,
    required: [true, "please enter a password"],
    minlength: [6, "minimum password length is 6 vro"],
  },
});


const User = mongoose.model("User", userSchema);
module.exports.User = User;


