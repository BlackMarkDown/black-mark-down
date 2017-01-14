module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // check if imports actually resolve
  settings: {
    'import/resolver': {
      webpack: {
        config: 'build/webpack.base.conf.js'
      }
    }
  },
  // add your custom rules here
  rules: {
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      js: 'never',
      vue: 'never',
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
  },
  globals: {
    __AWS_COGNITO_USER_POOL_ID__: false,
    __AWS_COGNITO_APP_ID__: false,
    __AMAZON_S3_BUCKET_NAME__: false,
    __AWS_COGNITO_TEST_USERNAME__: false,
    __AWS_COGNITO_TEST_PASSWORD__: false,
  },
}
