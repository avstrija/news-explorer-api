require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const cors = require('cors');
const userRouter = require('./routes/users');
const articleRouter = require('./routes/articles');
const auth = require('./middleware/auth');
const { loginUser, createUser } = require('./controllers/userController');
const { requestLogger, errorLogger } = require('./middleware/logger');
const { validEmail } = require('./helpers/validationPatterns');
const NotFoundError = require('./middleware/errors/NotFoundError');

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/newsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
})
  .then(() => {
  // eslint-disable-next-line no-console
    app.listen(PORT, () => console.log(`Server running at ${PORT}`));
  })
// eslint-disable-next-line no-console
  .catch((err) => console.log(`${err}: did not connect`));

// // only for reviewers
// app.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Server will crash now');
//   }, 0);
// });
app.use(express.json(), cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.post('/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().pattern(new RegExp('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,}$')),
      password: Joi.string().required(),
    }),
  }),
  loginUser);
app.post('/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().pattern(validEmail),
      password: Joi.string().trim().min(1).required(),
    }),
  }),
  createUser);

app.use(auth);
app.use('/', userRouter, articleRouter);
app.use('*', () => {
  throw new NotFoundError('Requested resource not found');
});

app.use(errorLogger);
app.use(errors());
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // if an error has no status, display 500
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      // check the status and display a message based on it
      message: statusCode === 500
        ? 'An error occurred on the server'
        : message,
    });
});
