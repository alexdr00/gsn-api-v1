const verifyIdToken = require('../lib/verifyIdToken');
const session = require('../lib/session');
const errorCodes = require('../constants/errorCodes');

async function checkUser(bearerToken, originEndpoint = '') {
  if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
    const error = {
      name: errorCodes.NOT_AUTHORIZED,
      code: errorCodes.NOT_AUTHORIZED,
      message: 'Please provide a Bearer token.',
    };
    throw error;
  }
  const isRefreshTokenEndpoint = originEndpoint.includes('/auth/refresh-token');
  const idToken = bearerToken.slice(7, bearerToken.length);
  const user = await verifyIdToken(idToken, {
    ignoreExpiration: isRefreshTokenEndpoint,
  });
  const userSession = await session.get(user.email);

  if (userSession === null) {
    const isSignOutEndpoint = originEndpoint.includes('/auth/sign-out');
    const sessionExpiredMsg = 'Your session expired. Please sign in again.';
    const alreadySignedOutMsg = 'You are already signed out.';
    const message = isSignOutEndpoint ? alreadySignedOutMsg : sessionExpiredMsg;

    const error = {
      name: errorCodes.SESSION_EXPIRED,
      code: errorCodes.SESSION_EXPIRED,
      message,
    };
    throw error;
  }

  return user;
}

module.exports = checkUser;
