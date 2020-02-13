const { createLogger, format, transports } = require('winston');

const {
  combine, timestamp, printf, errors, colorize, metadata,
} = format;

const customFormat = printf(({ level, message, metadata: meta }) => {
  const { name, body } = message;
  const messageWithName = `${name}: ${body}`;
  const error = meta.error ? `:\n${meta.error.stack}` : '';
  const messageBody = name ? messageWithName : message;

  return `(${meta.timestamp}) - [${level}] ${messageBody}${error}`;
});

const logsPath = `${__dirname}/../../logs`;

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MMM-D hh:mm:ss:SSS' }),
    metadata(),
    customFormat,
  ),
});
const isProductionEnv = process.env.NODE_ENV === 'production';
const isTestEnv = process.env.NODE_ENV === 'test';

if (!isTestEnv) {
  logger.add(new transports.File({
    filename: `${logsPath}/info.log`,
    level: 'info',
  }));
  logger.add(new transports.File({
    filename: `${logsPath}/errors.log`,
    level: 'error',
    format: combine(
      errors({ stack: true }),
    ),
  }));
}

if (!isProductionEnv) {
  logger.add(new transports.Console({
    level: 'debug',
    format: combine(
      colorize({ all: true }),
    ),
    silent: process.env.NODE_ENV === 'test',
  }));
  logger.add(new transports.File({
    filename: `${logsPath}/debug.log`,
    level: 'debug',
    format: combine(
      customFormat,
    ),
  }));
}

module.exports = logger;
