const cognito = require('../lib/cognito');
const ServiceException = require('../lib/ServiceException');
const userRepository = require('../repositories/userRepository');
const session = require('../lib/session');
const verifyIdToken = require('../lib/verifyIdToken');
const errorCodes = require('../constants/errorCodes');

function makeAuthService() {
  return {
    signIn, signUp, signOut, refreshIdToken,
  };

  async function signIn(signInData) {
    try {
      const { email, password } = signInData;
      const { tokens, payload: sessionData } = await cognito.signIn({ email, password });
      await session.set(sessionData);
      return tokens;
    } catch (error) {
      throw new ServiceException(error, 'SignInFailure');
    }
  }

  async function signUp(signUpData) {
    try {
      const { email, password, name } = signUpData;
      await cognito.signUp({ email, password, name });
      await userRepository.createUser({ email });
    } catch (error) {
      throw new ServiceException(error, 'SignUpFailure');
    }
  }

  async function signOut(email) {
    try {
      await cognito.signOut(email);
      await session.revoke(email);
    } catch (error) {
      throw new ServiceException(error, 'SignOutFailure');
    }
  }

  async function refreshIdToken(idToken, refreshToken) {
    try {
      const { email } = await verifyIdToken(idToken, { ignoreExpiration: true });
      const userSession = await session.get(email);
      if (!userSession) {
        const error = {
          name: errorCodes.SESSION_EXPIRED,
          code: errorCodes.SESSION_EXPIRED,
          message: 'Your session expired. Please sign in again.',
        };
        throw error;
      }
      const { tokens, payload: sessionDataUpdated } = await cognito.refreshIdToken(refreshToken, email);
      await session.set(sessionDataUpdated);
      return tokens;
    } catch (error) {
      throw new ServiceException(error, 'RefreshTokenFailure');
    }
  }
}

module.exports = makeAuthService();
