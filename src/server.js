const express = require('express');
const bodyParser = require('body-parser');

class Server {
  constructor() {
    this.app = express();
    this.setup();
  }

  setup() {
    this.useMiddleware();
    this.mountRoutes();
  }

  useMiddleware() {
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());
  }

  mountRoutes() {
    const router = express.Router();
    router.use('/health', (req, res) => res.send({ message: 'ok' }));

    this.app.use('/v1', router);
  }
}

module.exports = new Server();
