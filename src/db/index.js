const mysql = require('mysql');

function db() {
  const connection = establishConnection();

  return { run };

  function run(query, parameters) {
    return new Promise((resolve, reject) => {
      connection.query(query, parameters, (error, result) => {
        if (error) {
          reject(error);
        }

        resolve(result);
      });
    });
  }

  function establishConnection() {
    return mysql.createPool({
      connectionLimit: 10,
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });
  }
}

module.exports = db();
