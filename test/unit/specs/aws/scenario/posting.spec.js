import uuid from 'uuid';
import IdentityManager from 'src/aws/IdentityManager';
import Explorer from 'src/aws/Explorer';
import PostManager from 'src/aws/PostManager';


describe('scenario for posting test', () => {
  let fileID;
  function testQueryingFile(count, queryFunction = Explorer.queryMyFiles) {
    return queryFunction.call(Explorer)
    .then((files) => {
      expect(files).to.be.a('array');
      const filteredFiles = files.filter(file => file.ID === fileID);
      expect(filteredFiles).to.have.lengthOf(count);
      return filteredFiles[0];
    });
  }

  it('should success to login',
    () => {
      const {
        AWS_COGNITO_TEST_USERNAME: username,
        AWS_COGNITO_TEST_PASSWORD: password,
      } = process.env;
      return IdentityManager.logIn(username, password);
    });

  it('should success to init new file',
    () =>
      PostManager.init()
      .then((newFileID) => {
        expect(newFileID).to.be.a('string');
        fileID = newFileID;
      })
  );

  it('should success to query file that we inited',
    () =>
      testQueryingFile(1, Explorer.queryMyEditingFiles)
      .then(() => testQueryingFile(1))
  );

  it('should success to save while editing',
    () => {
      const title = uuid();
      const content = uuid();
      return PostManager.saveWhileEditing(fileID, title, content)
      .then(() => testQueryingFile(1, Explorer.queryMyEditingFiles))
      .then((file) => {
        expect(file).to.have.property('editingData');
        expect(file).to.have.deep.property('editingData.title');
        expect(file).to.have.deep.property('editingData.markdownFileLocation');
      })
      .then(() => testQueryingFile(1));
      // TODO: test s3 content is the same
    }
  );

  it('should success to post',
    () => {
      const title = uuid();
      const content = uuid();
      return PostManager.post(fileID, title, content)
      .then(() => testQueryingFile(1))
      .then(() => testQueryingFile(0, Explorer.queryMyEditingFiles))
      .then(() => testQueryingFile(1, Explorer.queryMyPostedFiles))
      .then((file) => {
        expect(file).to.have.property('title', title);
      });
      // TODO: test s3 content is the same
    }
  );
});
