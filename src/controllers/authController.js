const validateAuth = require('../validators/authValidator');
const authNormalizer = require('../normalizers/authNormalizer');
const handleError = require('../lib/handleError');
const handleSuccess = require('../lib/handleSuccess');
const authService = require('../services/authService');
const infoMessages = require('../constants/infoMessages');

function authController() {
  return { signOut, signIn, signUp };

  async function signIn(req, res) {
    try {
      const validatedData = validateAuth.validateSignInData(req.body);
      const normalize = authNormalizer(validatedData);
      const normalizedData = normalize.signInData();

      const tokens = await authService.signIn(normalizedData);

      const response = {
        message: infoMessages.SIGN_IN({ name: 'AlexTEMP' }),
        data: tokens,
      };
      handleSuccess(res, response);
    } catch (error) {
      handleError(res, error);
    }
  }

  async function signUp(req, res) {
    try {
      const validatedData = validateAuth.validateSignUpData(req.body);
      const normalize = authNormalizer(validatedData);
      const normalizedData = normalize.signUpData();

      await authService.signUp(normalizedData);
      const response = {
        message: infoMessages.SIGN_UP,
        data: null,
      };
      handleSuccess(res, response);
    } catch (error) {
      handleError(res, error);
    }
  }

  function signOut(req, res) {
    res.json({ c: 'signout' });
  }
}

module.exports = authController();
