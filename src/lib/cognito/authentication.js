const { CognitoRefreshToken, CognitoUser, AuthenticationDetails } = require('amazon-cognito-identity-js');
const errorCodes = require('../../constants/errorCodes');

function authentication(state) {
  const { userPool } = state;
  return { signIn, signOut, refreshIdToken };

  function signIn(user) {
    const { email, password } = user;

    const authenticationData = { Username: email, Password: password };
    const authenticationDetails = new AuthenticationDetails(
      authenticationData,
    );
    const userData = { Username: email, Pool: userPool };
    const cognitoUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess(result) {
          resolve(getResponsePayload(result));
        },
        onFailure(error) {
          reject(error);
        },
      });
    });
  }

  function signOut(email) {
    const userData = { Username: email, Pool: userPool };
    const cognitoUser = new CognitoUser(userData);
    return cognitoUser.signOut();
  }

  function refreshIdToken(refreshToken, email) {
    const userData = { Username: email, Pool: userPool };
    const cognitoUser = new CognitoUser(userData);
    const RefreshToken = new CognitoRefreshToken({ RefreshToken: refreshToken });
    return new Promise((resolve, reject) => {
      cognitoUser.refreshSession(RefreshToken, (err, result) => {
        const error = { ...err };

        if (err) {
          if (error.message === 'Refresh Token has expired') {
            error.code = errorCodes.SESSION_EXPIRED;
          }
          reject(err);
        }

        resolve(getResponsePayload(result));
      });
    });
  }

  function getResponsePayload(cognitoResult) {
    const idToken = cognitoResult.getIdToken().getJwtToken();
    const { payload } = cognitoResult.getIdToken();
    const refreshToken = cognitoResult.getRefreshToken().getToken();
    const tokens = { refreshToken, idToken };

    return { payload, tokens };
  }
}

module.exports = authentication;
