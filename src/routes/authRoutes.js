const { Router } = require('express');
const authController = require('../controllers/authController');

function makeAuthRouter() {
  const router = Router();

  router.get('/check-is-authenticated', authController.checkIsAuthenticated);
  router.post('/sign-in', authController.signIn);
  router.post('/sign-up', authController.signUp);
  router.post('/refresh-token', authController.refreshIdToken);
  router.delete('/sign-out', authController.signOut);

  return router;
}

module.exports = makeAuthRouter();
