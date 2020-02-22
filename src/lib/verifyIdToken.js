const fetch = require('node-fetch');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
// Refresh Token has expired
async function verifyIdToken(idToken) {
  const jwksUrl = process.env.JWKS_URL;
  const jwksResponse = await fetch(jwksUrl);
  const jwks = await jwksResponse.json();
  const jwkForIdToken = jwks.keys[0];
  const jwkPem = jwkToPem(jwkForIdToken);

  return new Promise((resolve, reject) => {
    jwt.verify(idToken, jwkPem, { algorithms: ['RS256'] }, (err, decodedToken) => {
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
