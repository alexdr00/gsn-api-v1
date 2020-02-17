const cognito = require('../lib/cognito');
const ServiceException = require('../lib/ServiceException');

function makeAuthService() {
  return { signIn, signUp };

  async function signIn(signInData) {
    try {
      const { email, password } = signInData;
      const tokens = await cognito.signIn({ email, password });
      return tokens;
    } catch (error) {
      throw new ServiceException(error, 'SignInFailure');
    }
  }

  async function signUp(signUpData) {
    try {
      const { email, password, name } = signUpData;
      await cognito.signUp({ email, password, name });
    } catch (error) {
      throw new ServiceException(error, 'SignUpFailure');
    }
  }
}

module.exports = makeAuthService();
