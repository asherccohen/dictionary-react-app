module.exports = {
  extends: [
    'airbnb-base',
    'plugin:react/recommended',
    'plugin:jest/recommended',
    'plugin:prettier/recommended',
  ],
  env: {
    browser: true,
  },
  rules: {
    'no-underscore-dangle': 0,
  },
  settings: {
    react: {
      version: '16.5', // React version, default to the latest React stable release
    },
  },
};
