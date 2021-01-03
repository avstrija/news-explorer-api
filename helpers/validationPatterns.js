const validURL = new RegExp('^https?:\\/\\/(www\\.)?[^\\s~<>]+\\.[^\\s~<>]+#?');
const validEmail = new RegExp('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,}$');

module.exports = { validURL, validEmail };
