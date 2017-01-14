import uuid from 'uuid';
import fetch from 'node-fetch';
import uploadImage from 'src/PostManager/uploadImage';


describe('PostManager/uploadImage.js', () => {
  let imageFile;
  before((done) => {
    fetch('http://www.w3schools.com/css/paris.jpg')
    .then(response => response.blob())
    .then((myBlob) => {
      imageFile = myBlob;
      done();
    });
  });

  it('should success to upload image into S3', (done) => {
    uploadImage('test', imageFile)
    .then(done);
  });
});
