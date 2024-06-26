module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: 'airbnb-base',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-console': ['error', { allow: ['info'] }],
    'class-methods-use-this': 'off',
    'no-plusplus': 'off',
  },
};
