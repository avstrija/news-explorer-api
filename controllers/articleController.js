const Article = require('../models/article');
const NotFoundError = require('../middleware/errors/NotFoundError');
const ForbiddenError = require('../middleware/errors/ForbiddenError');

const getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch(next);
};

const createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;

  Article.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .then((article) => res.status(200).send({ data: article }))
    .catch(next);
};

const deleteArticle = (req, res, next) => {
  const articleId = req.params.id;
  Article.findById(articleId)
    .then((article) => {
      if (!article) {
        throw new NotFoundError('Requested article not found.');
      } else if (String(article.owner) !== req.user._id) {
        throw new ForbiddenError('This is not your saved article, you can\'t delete it');
      } else {
        Article.findByIdAndRemove(articleId)
          .then(() => {
            res.status(200).send({ message: 'The article was removed.' });
          });
      }
    })
    .catch(next);
};

module.exports = {
  getArticles, createArticle, deleteArticle,
};
