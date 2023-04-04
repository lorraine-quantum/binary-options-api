const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const AdminSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Please enter an username'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Minimum password length is 6 characters'],
  },

  //passwordResetToken: String,
  //passwordResetExpires: Date,
 
});

// fire a function before doc saved to db
AdminSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
AdminSchema.methods.comparePassword = async function (passwordInput) {
  return await bcrypt.compare(passwordInput, this.password);
};

AdminSchema.methods.generateJWT = function (signature) {
  return jwt.sign({ id: this._id, username: this.username }, signature);
};
// static method to login user

const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;
