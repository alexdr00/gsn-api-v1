const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const fetch = require('node-fetch');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');

function authentication(state) {
  const { userPool } = state;
  return { signIn, signOut, verify };

  function signIn(user) {
    const { email, password } = user;

    const authenticationData = { Username: email, Password: password };
    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
      authenticationData,
    );
    const userData = { Username: email, Pool: userPool };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess(result) {
          const idToken = result.getIdToken().getJwtToken();
          const { payload } = result.getIdToken();
          const refreshToken = result.getRefreshToken().getToken();
          const tokens = { refreshToken, idToken };
          resolve({ tokens, payload });
        },
        onFailure(error) {
          reject(error);
        },
      });
    });
  }

  function signOut(email) {
    const userData = { Username: email, Pool: userPool };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    return cognitoUser.signOut();
  }

  async function verify(token) {
    const jwksUrl = process.env.JWKS_URL;
    const jwksResponse = await fetch(jwksUrl);
    const jwks = await jwksResponse.json();
    const jwkForIdToken = jwks.keys[0];
    const jwkPem = jwkToPem(jwkForIdToken);

    return jwt.verify(token, jwkPem, { algorithms: ['RS256'] }, (err, decodedToken) => {
      if (err) {
        throw err;
      }

      return decodedToken;
    });
  }
}

module.exports = authentication;
