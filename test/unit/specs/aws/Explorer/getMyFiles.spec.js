import AWS from 'aws-sdk';
import getMyFiles from 'src/aws/Explorer/getMyFiles';
import logIn from 'src/aws/IdentityManager/logIn';

describe('Explorer/getMyFiles.js', () => {
  before(() => {
    const {
      AWS_COGNITO_TEST_USERNAME: username,
      AWS_COGNITO_TEST_PASSWORD: password,
    } = process.env;
    return logIn(username, password);
  });

  it('should success to get files from User table',
    () =>
    getMyFiles()
    .then((files) => {
      expect(files).to.be.an('array');
    }));
});
