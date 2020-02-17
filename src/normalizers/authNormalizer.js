const { capitalizePhrase } = require('../helpers/capitalize');

function makeAuthNormalizer(authData) {
  const commonDataNormalized = {
    email: authData.email.toLowerCase(),
  };
  return { signInData, signUpData };

  function signInData() {
    return {
      ...authData,
      ...commonDataNormalized,
    };
  }

  function signUpData() {
    return {
      ...authData,
      ...commonDataNormalized,
      name: capitalizePhrase(authData.name),
    };
  }
}

module.exports = makeAuthNormalizer;
