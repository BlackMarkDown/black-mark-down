import login from 'src/IdentityManager/login';

describe('IdentityManager/login.js', () => {
  it('should success to log in with test ID', (done) => {
    login(__AWS_COGNITO_TEST_USERNAME__, __AWS_COGNITO_TEST_PASSWORD__)
    .then(done);
  });
});
