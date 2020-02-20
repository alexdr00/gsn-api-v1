const redis = require('../lib/redis');

function makeSession() {
  return { set, get, revoke };

  function set(sessionPayload) {
    return new Promise((resolve, reject) => {
      const sessionKey = sessionPayload.email;
      const sessionString = JSON.stringify(sessionPayload);
      return redis.set(sessionKey, sessionString, (err, res) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(res);
      });
    });
  }

  async function get(email) {
    return new Promise((resolve, reject) => {
      redis.get(email, (err, sessionString) => {
        if (err) {
          reject(err);
          return;
        }

        const sessionParsed = JSON.parse(sessionString);
        resolve(sessionParsed);
      });
    });
  }

  async function revoke(email) {
    return new Promise((resolve, reject) => {
      redis.del(email, (err, res) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(res);
      });
    });
  }
}

module.exports = makeSession();
