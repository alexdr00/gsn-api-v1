const handleError = require('../lib/handleError');
const checkUser = require('../lib/checkUser');

async function requireAuth(req, res, next) {
  const originEndpoint = req.originalUrl;

  const unprotectedEndpoints = [
    '/auth/sign-in',
    '/auth/sign-up',
    '/auth/refresh-token',
    '/health',
  ];

  const isUnprotectedEndpoint = unprotectedEndpoints.find((unprotectedEndpoint) => (
    originEndpoint.includes(unprotectedEndpoint)
  ));

  if (isUnprotectedEndpoint) {
    return next();
  }

  try {
    const { authorization: bearerToken } = req.headers;

    const user = await checkUser(bearerToken, originEndpoint);
    req.user = user;
    next();
  } catch (error) {
    return handleError(res, error);
  }
}

module.exports = requireAuth;
