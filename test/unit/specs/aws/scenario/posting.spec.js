import uuid from 'uuid';
import IdentityManager from 'src/aws/IdentityManager';
import Explorer from 'src/aws/Explorer';
import PostManager from 'src/aws/PostManager';


describe('scenario for posting test', () => {
  let fileURL;
  const {
    username,
    password,
  } = process.env.AWS_COGNITO_TEST;
  it('should success to login',
    () => IdentityManager.logIn(username, password));

  it('should success to init new file',
    () =>
      PostManager.init(`${username}/`)
      .then((url) => {
        expect(url).to.be.a('string');
        fileURL = url;
      })
  );
/*
  it('should success to query file that we inited',
    () =>
      testQueryingFile(1, Explorer.queryMyEditingFiles)
      .then(() => testQueryingFile(1))
  );

  it('should success to save while editing',
    () => {
      const filename = uuid();
      const content = uuid();
      return PostManager.saveWhileEditing(fileID, filename, content)
      .then(() => testQueryingFile(1, Explorer.queryMyEditingFiles))
      .then((file) => {
        expect(file).to.have.property('editingData');
        expect(file).to.have.deep.property('editingData.filename');
        expect(file).to.have.deep.property('editingData.markdownFileLocation');
      })
      .then(() => testQueryingFile(1));
      // TODO: test s3 content is the same
    }
  );

  it('should success to post',
    () => {
      const filename = uuid();
      const content = uuid();
      return PostManager.post(fileID, filename, content)
      .then(() => testQueryingFile(1))
      .then(() => testQueryingFile(0, Explorer.queryMyEditingFiles))
      .then(() => testQueryingFile(1, Explorer.queryMyPostedFiles))
      .then((file) => {
        expect(file).to.have.property('filename', filename);
      });
      // TODO: test s3 content is the same
    }
  );
  */
});
