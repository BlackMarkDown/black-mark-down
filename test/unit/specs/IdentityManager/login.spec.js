import logIn from 'src/IdentityManager/logIn';

describe('IdentityManager/login.js', () => {
  it('should success to log in with test ID', () => {
    const {
      AWS_COGNITO_TEST_USERNAME: username,
      AWS_COGNITO_TEST_PASSWORD: password,
    } = process.env;
    return logIn(username, password);
  });
});
