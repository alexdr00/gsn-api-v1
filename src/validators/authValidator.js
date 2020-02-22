const Joi = require('../lib/joi');

/* This regex checks the password has at least:
  - 8 chars length
  - 1 uppercase leter
  - 1 lowercase leter
  - 1 number */
const passwordValidityRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

const commonSchema = {
  email: Joi.string()
    .email()
    .required(),
};

const signInSchema = Joi.object({
  ...commonSchema,
  password: Joi.string()
    .required(),
});

const signUpSchema = Joi.object({
  ...commonSchema,
  password: Joi.string()
    .pattern(passwordValidityRegex, { name: 'Password Validity' })
    .message('Password must have at least: - 8 characters, - 1 uppercase letter, - 1 lowercase letter, - 1 number')
    .required(),
  name: Joi.string()

    .required(),
});

const tokensSchema = Joi.object({
  idToken: Joi.string()
    .required(),
  refreshToken: Joi.string()
    .required(),
});

function makeAuthValidator() {
  return { validateSignInData, validateSignUpData, validateTokensData };

  function validateSignInData(signInData) {
    const validation = signInSchema.validate(signInData);

    if (validation.error) {
      throw validation.error;
    }

    return validation.value;
  }

  function validateSignUpData(signUpData) {
    const validation = signUpSchema.validate(signUpData);

    if (validation.error) {
      throw validation.error;
    }

    return validation.value;
  }

  function validateTokensData(tokens) {
    const validation = tokensSchema.validate(tokens);

    if (validation.error) {
      throw validation.error;
    }

    return validation.value;
  }
}

module.exports = makeAuthValidator();
