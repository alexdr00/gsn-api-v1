const appName = process.env.APP_NAME || 'GSN';

module.exports = {
  SIGN_UP: {
    name: 'Sign up succesful.',
    body: `Please confirm your email to start using ${appName}.`,
    detail: 'You need to confirm your email so you have a way to recover your account if you lose it. '
      + "Besides we'll send you email notifications whenever a game you're following gets a sale!",
  },
  SIGN_IN: {
    name: 'Sign in succesful.',
    body: 'Hi there!',
    detail: null,
  },
  SIGN_OUT: {
    name: 'Sign out succesful.',
    body: 'Bye!',
    detail: null,
  },
  ID_TOKEN_REFRESHED: {
    name: 'Id token refreshed successfully.',
    body: 'Id token refreshed successfully!',
    detail: null,
  },
};
