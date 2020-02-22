const fetch = require('node-fetch');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');

async function verifyIdToken(idToken, options = {}) {
  const jwksUrl = process.env.JWKS_URL;
  const jwksResponse = await fetch(jwksUrl);
  const jwks = await jwksResponse.json();
  const jwkForIdToken = jwks.keys[0];
  const jwkPem = jwkToPem(jwkForIdToken);
  const verifyOptions = { algorithms: ['RS256'], ...options };

  return new Promise((resolve, reject) => {
    jwt.verify(idToken, jwkPem, verifyOptions, (err, decodedToken) => {
      const error = { ...err };

      if (err) {
        if (error.name === 'JsonWebTokenError') {
          error.name = 'NotAuthorizedException';
        }
        error.code = error.name;
        reject(error);
      }

      resolve(decodedToken);
    });
  });
}

module.exports = verifyIdToken;
