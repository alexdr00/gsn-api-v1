const validateAuth = require('../validators/authValidator');
const authNormalizer = require('../normalizers/authNormalizer');
const handleError = require('../lib/handleError');
const handleSuccess = require('../lib/handleSuccess');
const authService = require('../services/authService');
const infoMessages = require('../constants/infoMessages');
const checkUser = require('../lib/checkUser');

function makeAuthController() {
  return {
    signIn, signUp, signOut, checkIsAuthenticated, refreshIdToken,
  };

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

  async function checkIsAuthenticated(req, res) {
    try {
      const { authorization: bearerToken } = req.headers;

      await checkUser(bearerToken);
      const responsePayload = {
        message: null,
        data: true,
      };
      handleSuccess(res, responsePayload);
    } catch (error) {
      handleError(res, error);
    }
  }

  async function refreshIdToken(req, res) {
    try {
      const validatedData = validateAuth.validateTokensData(req.body);
      const { email } = req.user;
      const { refreshToken } = validatedData;

      const tokens = await authService.refreshIdToken(refreshToken, email);
      const responsePayload = {
        message: infoMessages.ID_TOKEN_REFRESHED,
        data: tokens,
      };
      handleSuccess(res, responsePayload);
    } catch (error) {
      handleError(res, error);
    }
  }
}

module.exports = makeAuthController();
