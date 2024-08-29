// logger.js
const winston = require('winston');

// Define your log levels and formats
const logLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4,
    silly: 5,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    verbose: 'cyan',
    debug: 'magenta',
    silly: 'gray',
  },
};

const logger = winston.createLogger({
  level: 'info',
  levels: logLevels.levels,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'application.log' }),
  ],
});

// Optionally, add color support
winston.addColors(logLevels.colors);

module.exports = logger;
