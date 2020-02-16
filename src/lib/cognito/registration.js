const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

function cognitoRegistration(state) {
  const { userPool } = state;
  return { signUp };

  function signUp(user) {
    const { name, email, password } = user;

    const nameAttribute = { Name: 'name', Value: name };
    const cognitoNameAttribute = new AmazonCognitoIdentity.CognitoUserAttribute(nameAttribute);
    const attributeList = [cognitoNameAttribute];

    return new Promise((resolve, reject) => {
      userPool.signUp(email, password, attributeList, null, (err, result) => {
        if (err) {
          reject(err);
        }

        resolve(result);
      });
    });
  }
}

module.exports = cognitoRegistration;
