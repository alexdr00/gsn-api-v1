const cognito = require('../lib/cognito');
const ServiceException = require('../lib/ServiceException');
const userRepository = require('../repositories/userRepository');
const session = require('../lib/session');

function makeAuthService() {
  return { signIn, signUp, signOut };

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
}

module.exports = makeAuthService();
