const db = require('../db');

function makeUserRepository() {
  return { createUser };

  async function createUser(user) {
    const { email } = user;

    const query = `
      INSERT INTO user (email) VALUES (?)
    `;

    const parameters = [email];
    return db.run(query, parameters);
  }
}

module.exports = makeUserRepository();
