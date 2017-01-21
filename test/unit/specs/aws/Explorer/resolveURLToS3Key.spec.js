import resolveURLToS3Key, { getPrefix } from 'src/aws/Explorer/resolveURLToS3Key';
import Explorer from 'src/aws/Explorer';

describe('Explorer/resolveURLToS3Key.js', () => {
  it('should success to resolve cases', () => {
    const urls = ['/abc/def/',
      '/abc/def',
      'abc/def/',
      'abc/def'];
    const objectTypes = [
      Explorer.ObjectType.FOLDER,
      Explorer.ObjectType.PUBLIC_FILE,
      Explorer.ObjectType.DRAFT_FILE,
    ];
    objectTypes.forEach(objectType =>
      urls.forEach((url) => {
        const expectedS3Key = `/${getPrefix(Explorer.ObjectType.FOLDER)}abc/${getPrefix(objectType)}def`;
        expect(resolveURLToS3Key(url, objectType)).to.equal(expectedS3Key);
      })
    );
  });
});
