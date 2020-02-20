const redis = require('redis');
const logger = require('./logger');

function makeRedisConnection() {
  const client = redis.createClient({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || '6379',
  });

  client.on('connect', () => {
    logger.info('Redis connected successfully.');
  });

  client.on('error', (error) => {
    logger.error(error);
  });

  return client;
}

module.exports = makeRedisConnection();
