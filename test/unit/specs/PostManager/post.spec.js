import uuid from 'uuid';
import post from 'src/PostManager/post';

describe('PostManager/post.js', () => {
  it('should success to post into S3', (done) => {
    post(`test-${uuid()}`, 'test')
    .then(done);
  });
});
