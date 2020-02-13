'use strict';
require('dotenv').config();
const server = require('./src/server');

const { app } = server;

const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, (error) => {
  if (error) {
    console.error ("Couldn't start server", error);
    process.exit(1);
  }

  console.log(`Server is listening on port ${PORT}`);
});
