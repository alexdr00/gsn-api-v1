const pino = require('pino');
const path = require('path');
const { format } = require('date-fns');

const destination = path.resolve(__dirname, '../../logs/logs.log');

const isProductionEnv = process.env.NODE_ENV === 'production';

const options = {
  base: null,
  useLevelLabels: true,
  prettyPrint: isProductionEnv ? false : {
    colorize: true,
    levelFirst: true,
    ignore: 'stack',
  },
  mixin: () => {
    const now = new Date();
    const nowFormatted = format(now, 'yyyy/MMM/dd HH:mm:ss');
    return { timeFormatted: nowFormatted };
  },
};

const logger = pino(options, isProductionEnv ? destination : null);

module.exports = logger;
