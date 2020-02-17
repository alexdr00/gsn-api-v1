const { Router } = require('express');
const authController = require('../controllers/authController');

function makeAuthRouter() {
  const router = Router();

  router.post('/sign-in', authController.signIn);
  router.post('/sign-up', authController.signUp);
  router.post('/sign-out', authController.signOut);

  return router;
}

module.exports = makeAuthRouter();
