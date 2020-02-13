const mysql = require('mysql');

class Db {
  constructor() {
    this.connection = Db.establishConnection();
  }

  run(query, parameters = []) {
    return new Promise((resolve, reject) => {
      this.connection.query(query, parameters, (error, result) => {
        if (error) {
          reject(error);
        }

        resolve(result);
      });
    });
  }

  static establishConnection() {
    return mysql.createPool({
      connectionLimit: 10,
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });
  }

  closeConnection() {
    return new Promise((resolve, reject) => {
      this.connection.end((error) => {
        if (error) {
          reject(error);
        }

        resolve();
      });
    });
  }
}

module.exports = new Db();
