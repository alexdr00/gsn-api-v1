const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const authRouter = require('./routes/authRoutes');

function server() {
  const app = express();
  setup();

  return { app };

  function setup() {
    useMiddleware();
    mountRoutes();
  }

  function useMiddleware() {
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(morgan('dev'));
  }

  function mountRoutes() {
    const router = express.Router();
    router.use('/auth', authRouter);
    router.use('/health', (req, res) => res.send({ message: 'ok' }));

    app.use('/v1', router);
  }
}

module.exports = server();
