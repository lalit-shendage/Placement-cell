const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require('bcrypt');


const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  }

});

UserSchema.virtual('password').set(function (value) {
  this.passwordHash = bcrypt.hashSync(value, 12);
});

UserSchema.methods.isPasswordCorrect = function (password) {
  return bcrypt.compareSync(password, this.passwordHash);
};


module.exports = mongoose.model("User", UserSchema);