const express = require('express');
const { celebrate, Joi } = require('celebrate');
const {
  getArticles, createArticle, deleteArticle,
} = require('../controllers/articleController');
const { validURL, dateFormat } = require('../helpers/validationPatterns');

const router = express.Router();

router.get('/articles', getArticles);
router.post('/articles',
  celebrate({
    body: Joi.object().keys({
      keyword: Joi.string().required(),
      title: Joi.string().required(),
      text: Joi.string().required(),
      date: Joi.date().max('now'),
      source: Joi.string().required(),
      link: Joi.string().pattern(validURL),
      image: Joi.string().pattern(validURL),
    }),

  }),
  createArticle);
router.delete('/articles/:id', celebrate({
  headers: Joi.object()
    .keys({
      authorization: Joi.string().required(),
    })
    .options({ allowUnknown: true }),
  params: Joi.object().keys({
    id: Joi.string().required().length(24).hex(),
  }),
}),
deleteArticle);

module.exports = router;
