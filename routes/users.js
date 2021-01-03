const express = require('express');

const {
  getUserInfo,
} = require('../controllers/userController');

const router = express.Router();

router.get('/users/me', getUserInfo);

module.exports = router;
