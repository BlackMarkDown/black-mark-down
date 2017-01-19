import uuid from 'uuid';
import IdentityManager from 'src/aws/IdentityManager';
import Explorer from 'src/aws/Explorer';
import PostManager from 'src/aws/PostManager';


describe('scenario for folder', () => {
  it('should success to login',
    () => {
      const {
        username,
        password,
      } = process.env.AWS_COGNITO_TEST_FOLDER;
      return IdentityManager.logIn(username, password);
    });

  it('should success to list my root',
    () =>
      Explorer.list('/')
      .then(list => {
        expect(list).to.be.a('array');
      })
  );
});
