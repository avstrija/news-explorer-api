const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../middleware/errors/NotFoundError');
const ConflictError = require('../middleware/errors/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;
const SALT_ROUND = 10;

// current user
const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User not found.');
      }
      res.send(user);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  return bcrypt.hash(password, SALT_ROUND, (err, hash) => {
    User.findOne({ email })
      .then((oldUser) => {
        if (oldUser) {
          throw new ConflictError('User with this email address already exists');
        }
        return User.create({
          name, email, password: hash,
        })
          .then((user) => res.status(200).send({
            data: {
              name: user.name,
              email: user.email,
              _id: user._id,
            },
          }));
      })
      .catch(next);
  });
};

const loginUser = (req, res, next) => {
  const { password, email } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
      return res.status(200).send({ token });
    })
    .catch(next);
};

module.exports = {
  getUserInfo, createUser, loginUser,
};
