const express = require('express');
const bodyParser = require('body-parser');

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
  }

  function mountRoutes() {
    const router = express.Router();
    router.use('/health', (req, res) => res.send({ message: 'ok' }));

    app.use('/v1', router);
  }
}

module.exports = server();
