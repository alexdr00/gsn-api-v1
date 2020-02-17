const validateAuth = require('../validators/authValidator');
const authNormalizer = require('../normalizers/authNormalizer');
const handleError = require('../lib/handleError');
const authService = require('../services/authService');

function authController() {
  return { signOut, signIn, signUp };

  async function signIn(req, res) {
    try {
      const validatedData = validateAuth.validateSignInData(req.body);
      const normalize = authNormalizer(validatedData);
      const normalizedData = normalize.signInData();

      const tokens = await authService.signIn(normalizedData);

      res.status(200).json({ data: tokens });
    } catch (error) {
      handleError(res, error);
    }
  }

  async function signUp(req, res) {
    try {
      const validatedData = validateAuth.validateSignUpData(req.body);
      const normalize = authNormalizer(validatedData);
      const normalizedData = normalize.signUpData();

      const tokens = await authService.signUp(normalizedData);

      res.status(201).json({ data: tokens });
    } catch (error) {
      handleError(res, error);
    }
  }

  function signOut(req, res) {
    res.json({ c: 'signout' });
  }
}

module.exports = authController();
