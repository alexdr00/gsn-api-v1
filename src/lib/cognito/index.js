const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const AWS = require('aws-sdk/global');
const fetch = require('node-fetch');
const cognitoRegistration = require('./registration');
const cognitoAuthentication = require('./authentication');

global.fetch = fetch;

function makeCognitoConnection() {
  const userPoolId = process.env.COGNITO_USER_POOL_ID;
  const identityPoolId = process.env.COGNITO_IDENTITY_POOL_ID;
  const appClientId = process.env.COGNITO_APP_CLIENT_ID;
  const awsRegion = process.env.AWS_REGION;
  const poolData = { UserPoolId: userPoolId, ClientId: appClientId };
  const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

  const state = {
    userPoolId,
    identityPoolId,
    awsRegion,
    appClientId,
    poolData,
    userPool,
  };

  AWS.config.region = state.awsRegion;
  return Object.freeze({
    ...cognitoRegistration(state),
    ...cognitoAuthentication(state),
  });
}

module.exports = makeCognitoConnection();
