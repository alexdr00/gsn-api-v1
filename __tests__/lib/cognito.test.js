const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const cognito = require('../../src/lib/cognito');

describe('Cognito', () => {
  let userPool;
  let userAttribute;

  beforeEach(() => {
    [userPool] = AmazonCognitoIdentity.CognitoUserPool.mock.instances;
    userAttribute = AmazonCognitoIdentity.CognitoUserAttribute.mock.calls;
  });

  test('Sign up passes the right credentials', () => {
    const credentials = {
      email: 'email@email.com',
      name: 'nameTest',
      password: 'pass',
    };
    cognito.signUp(credentials);
    const [signUpArguments] = userPool.signUp.mock.calls;
    const [email, password, attributeList, validationData, callback] = signUpArguments;

    expect(email).toBe(credentials.email);
    expect(password).toBe(credentials.password);
    expect(validationData).toBe(null);
    expect(callback);
    expect(attributeList);
    expect(userAttribute[0][0].Value).toBe(credentials.name);
  });
});
