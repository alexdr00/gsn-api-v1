const cognito = require('../lib/cognito');
const ServiceException = require('../lib/ServiceException');
const userRepository = require('../repositories/userRepository');

function makeAuthService() {
  return { signIn, signUp };

  async function signIn(signInData) {
    try {
      const { email, password } = signInData;
      const { tokens, payload } = await cognito.signIn({ email, password });

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
}

module.exports = makeAuthService();
