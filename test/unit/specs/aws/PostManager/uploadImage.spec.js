/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* global fetch */
import 'whatwg-fetch';
import uploadImage from 'src/aws/PostManager/uploadImage';

describe('PostManager/uploadImage.js', () => {
  let image;
  before(() => fetch('http://placehold.it/120x120&text=image1')
    .then(response => response.blob())
    .then((blob) => {
      image = blob;
    }));

  it('should success to upload image into S3', () => uploadImage('test', image));
});
