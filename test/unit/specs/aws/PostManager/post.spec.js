import uuid from 'uuid';
import post from 'src/aws/PostManager/post';
import logIn from 'src/aws/IdentityManager/logIn';
import getMyFiles from 'src/aws/Explorer/getMyFiles';

describe('PostManager/post.js', () => {
  before(() => {
    const {
      AWS_COGNITO_TEST_USERNAME: username,
      AWS_COGNITO_TEST_PASSWORD: password,
    } = process.env;
    return logIn(username, password);
  });

  it('should success to post into S3 and DynamoDB',
    () => {
      const title = `test-${uuid()}`;
      const content = `test-${uuid()}`;
      return post(title, content)
      .then(getMyFiles)
      .then((files) => {
        const sameTitleFiles = files.filter(file => file.title === title);
        expect(sameTitleFiles).to.have.lengthOf(1);
      });
    }
  );
});
