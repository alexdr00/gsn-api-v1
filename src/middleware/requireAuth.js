const handleError = require('../lib/handleError');
const verifyUser = require('../lib/verifyIdToken');
const session = require('../lib/session');
const errorCodes = require('../constants/errorCodes');

async function requireAuth(req, res, next) {
  const originEndpoint = req.originalUrl;

  const unprotectedEndpoints = [
    '/auth/sign-in',
    '/auth/sign-up',
  ];

  const isUnprotectedEndpoint = unprotectedEndpoints.find((unprotectedEndpoint) => (
    originEndpoint.includes(unprotectedEndpoint)
  ));

  if (isUnprotectedEndpoint) {
    return next();
  }

  try {
    const { authorization: bearerToken } = req.headers;

    if (!bearerToken && !bearerToken.startsWith('Bearer ')) {
      const error = {
        name: errorCodes.NOT_AUTHORIZED,
        code: errorCodes.NOT_AUTHORIZED,
        message: 'Please provide a Bearer token.',
      };
      throw error;
    }

    const idToken = bearerToken.slice(7, bearerToken.length);
    const user = await verifyUser(idToken);
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

    req.user = user;
    next();
  } catch (error) {
    return handleError(res, error);
  }
}

module.exports = requireAuth;
