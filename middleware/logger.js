const winston = require('winston');
const fs = require('fs');
const path = require('path');
const expressWinston = require('express-winston');

const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  // Create the directory if it does not exist
  fs.mkdirSync(logDir);
}

const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: path.join(logDir, 'request.log') }),
  ],
  format: winston.format.json(),
});

const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: path.join(logDir, 'error.log') }),
  ],
  format: winston.format.json(),
});

module.exports = {
  requestLogger,
  errorLogger,
};
