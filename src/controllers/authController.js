const validateAuth = require('../validators/authValidator');
const authNormalizer = require('../normalizers/authNormalizer');
const handleError = require('../lib/handleError');
const handleSuccess = require('../lib/handleSuccess');
const authService = require('../services/authService');
const infoMessages = require('../constants/infoMessages');

function authController() {
  return { signIn, signUp, signOut };

  async function signIn(req, res) {
    try {
      const validatedData = validateAuth.validateSignInData(req.body);
      const normalize = authNormalizer(validatedData);
      const normalizedData = normalize.signInData();

      const tokens = await authService.signIn(normalizedData);

      const responsePayload = {
        message: infoMessages.SIGN_IN,
        data: tokens,
      };
      handleSuccess(res, responsePayload);
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
      const responsePayload = {
        message: infoMessages.SIGN_UP,
        data: null,
      };
      handleSuccess(res, responsePayload);
    } catch (error) {
      handleError(res, error);
    }
  }

  async function signOut(req, res) {
    try {
      const { email } = req.user;
      await authService.signOut(email);
      const responsePayload = {
        message: infoMessages.SIGN_OUT,
        data: null,
      };
      handleSuccess(res, responsePayload);
    } catch (error) {
      handleError(error);
    }
  }
}

module.exports = authController();
