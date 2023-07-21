const mongoose = require('mongoose');
const crypto = require('crypto');
const userSchema = new mongoose.Schema(
  {
    name: {type: String, require: true},
    email: {
      type: String,
      required: true,
      unique: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },

    salt: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {timestamp: true},
);
// Virtual field for the password
userSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// Method to encrypt the password
userSchema.methods.encryptPassword = function (password) {
  return crypto.createHmac('sha256', this.salt).update(password).digest('hex');
};
module.exports = User = mongoose.model('users', userSchema);
