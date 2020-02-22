module.exports = {
  env: {
    node: true,
    es6: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'strict': 'off',
    'no-use-before-define': 'off',
    'no-unused-vars': 'warn',
    'consistent-return': 'off',
    'max-len': ['error', { code: 120 }]
  },
};
