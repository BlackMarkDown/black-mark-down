import logIn from 'src/aws/IdentityManager/logIn';

describe('IdentityManager/login.js', () => {
  it('should success to log in with test ID', () => {
    const {
      username,
      password,
    } = process.env.AWS_COGNITO_TEST;
    return logIn(username, password);
  });
});
