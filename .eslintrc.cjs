module.exports = {
  root: true,
  env: {
    commonjs: true,
    es6: true,
    node: true
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  reportUnusedDisableDirectives: true,
  parserOptions: {
    sourceType: 'module'
  },
  rules: {}
};
