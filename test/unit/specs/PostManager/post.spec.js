import uuid from 'uuid';
import post from 'src/PostManager/post';
import logIn from 'src/IdentityManager/logIn';

describe('PostManager/post.js', () => {
  before(() => {
    const {
      AWS_COGNITO_TEST_USERNAME: username,
      AWS_COGNITO_TEST_PASSWORD: password,
    } = process.env;
    return logIn(username, password);
  });

  it('should success to post into S3', () => post(`test-${uuid()}`, 'test')).timeout(0);
});
