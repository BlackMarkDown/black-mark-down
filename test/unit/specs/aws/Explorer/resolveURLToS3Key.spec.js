import resolveURLToS3Key, { getPrefix, getSuffix } from 'src/aws/Explorer/resolveURLToS3Key';
import Explorer from 'src/aws/Explorer';

describe('Explorer/resolveURLToS3Key.js', () => {
  it('should success to resolve cases', () => {
    const folderUrls = [
      '/abc/def/',
      'abc/def/',
    ];
    const urls = [
      '/abc/def',
      'abc/def',
    ];
    const objectTypes = [
      Explorer.ObjectType.FOLDER,
      Explorer.ObjectType.PUBLIC_FILE,
      Explorer.ObjectType.DRAFT_FILE,
    ];
    objectTypes.forEach((objectType) => {
      urls.forEach((url) => {
        const expectedS3Key = `abc/${getPrefix(objectType)}def${getSuffix(objectType)}`;
        expect(resolveURLToS3Key(url, objectType)).to.equal(expectedS3Key);
      });
      folderUrls.forEach((url) => {
        if (objectType !== Explorer.ObjectType.FOLDER) {
          return expect(resolveURLToS3Key.bind(null, url, objectType)).to.throw(Error);
        }
        const expectedS3Key = `abc/${getPrefix(objectType)}def${getSuffix(objectType)}`;
        return expect(resolveURLToS3Key(url, objectType)).to.equal(expectedS3Key);
      });
    });
  });
});
