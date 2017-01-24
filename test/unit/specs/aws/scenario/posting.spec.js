import uuid from 'uuid';
import IdentityManager from 'src/aws/IdentityManager';
import Explorer from 'src/aws/Explorer';
import PostManager from 'src/aws/PostManager';


describe('scenario for posting test', () => {
  let filePath;
  let content;
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
        filePath = url;
      })
  );

  it('should success to get file that we inited',
    () =>
      Explorer.getFile(filePath, Explorer.ObjectType.DRAFT_FILE)
  );

  it('should success to save content while editing',
    () => {
      content = uuid();
      return PostManager.saveWhileEditing(filePath, content)
      .then(() => Explorer.getFile(filePath, Explorer.ObjectType.DRAFT_FILE))
      .then((uploadedContent) => {
        expect(uploadedContent).to.equal(content);
      });
    }
  );

  it('should success to change filename while editing',
    () => {
      const newFileName = uuid();
      const lastDelimiterIndex = filePath.lastIndexOf('/');
      const newFilePath = `${filePath.slice(0, lastDelimiterIndex + 1)}${newFileName}`;
      return PostManager.saveWhileEditing(filePath, content, newFilePath)
      .then(() => {
        filePath = newFilePath;
        return Explorer.getFile(filePath, Explorer.ObjectType.DRAFT_FILE);
      })
      .then((uploadedContent) => {
        expect(uploadedContent).to.equal(content);
      });
    }
  );
/*
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
