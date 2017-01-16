import uuid from 'uuid';
import post from 'src/aws/PostManager/post';
import logIn from 'src/aws/IdentityManager/logIn';

describe('PostManager/post.js', () => {
  before(() => {
    const {
      AWS_COGNITO_TEST_USERNAME: username,
      AWS_COGNITO_TEST_PASSWORD: password,
    } = process.env;
    return logIn(username, password);
  });

  it('should success to post into S3 and DynamoDB', () => post(`test-${uuid()}`, 'test'));
});
