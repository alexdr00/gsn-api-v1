jest.mock('../../src/lib/session.js');
jest.mock('../../src/lib/verifyIdToken.js');
const checkUser = require('../../src/lib/checkUser');
const errorCodes = require('../../src/constants/errorCodes');
const verifyIdToken = require('../../src/lib/verifyIdToken.js');
const session = require('../../src/lib/session.js');

describe('lib/checkUser', () => {
  it('Throws NotAuthorizedException if bearer token is invalid or doesn\'t exist', async () => {
    try {
      await checkUser('Not Valid Bearer Token');
    } catch (error) {
      expect(error.name).toBe(errorCodes.NOT_AUTHORIZED);
    }

    try {
      await checkUser();
    } catch (error) {
      expect(error.name).toBe(errorCodes.NOT_AUTHORIZED);
    }

    expect.assertions(2);
  });

  it('Throws NotAuthorizedException if bearer token doesn\'t start with "Bearer"', async () => {
    try {
      const token = 'Token_Without_Bearer_In_The_Beginning';
      await checkUser(token);
    } catch (error) {
      expect(error.name).toBe(errorCodes.NOT_AUTHORIZED);
    }

    expect.assertions(1);
  });

  it('Works well when starts with "Bearer"', async () => {
    const token = 'Bearer token_here';
    await checkUser(token);
  });

  it('Ignore expiration if refresh token endpoint is hit', async () => {
    const originEndpoint = 'http://localhost:3000/v1/auth/refresh-token';
    await checkUser('Bearer ', originEndpoint);
    const optionsArgument = verifyIdToken.mock.calls[0][1];
    expect(optionsArgument.ignoreExpiration).toBe(true);
  });

  it('Do not verify expiration if other than refresh token endpoint is hit', async () => {
    const originEndpoint = 'http://localhost:3000/v1/protected';
    await checkUser('Bearer ', originEndpoint);
    const optionsArgument = verifyIdToken.mock.calls[0][1];
    expect(optionsArgument.ignoreExpiration).toBe(false);
  });

  it('Capture just the token at the moment of verification', async () => {
    const bearerToken = 'Bearer TokenHere';
    await checkUser(bearerToken);
    const tokenArgument = verifyIdToken.mock.calls[0][0];
    expect(tokenArgument).toBe('TokenHere');
  });

  it('Throws SessionExpiredError if session expired', async () => {
    const bearerToken = 'Bearer token';
    session.get = jest.fn().mockReturnValue(null);
    try {
      await checkUser(bearerToken);
    } catch (error) {
      expect(error.name).toBe(errorCodes.SESSION_EXPIRED);
    }

    expect.assertions(1);
  });

  it('Throws already sign out message if session is expired origin endpoint is auth/sign-out', async () => {
    const bearerToken = 'Bearer token';
    const originEndpoint = 'http://localhost:3000/auth/sign-out';
    session.get = jest.fn().mockReturnValue(null);
    try {
      await checkUser(bearerToken, originEndpoint);
    } catch (error) {
      expect(error.message).toBe('You are already signed out.');
    }

    expect.assertions(1);
  });
});
