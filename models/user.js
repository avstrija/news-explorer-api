const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const NotFoundError = require('../middleware/errors/NotFoundError');
const AuthError = require('../middleware/errors/AuthError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'News Geek',
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User not found.');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError('Incorrect email or password');
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
