/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
/* global fetch window */
import 'whatwg-fetch';
import uploadImage from 'src/aws/PostManager/uploadImage';

const convertBase64ToBase64 = blob => new Promise((resolve) => {
  const reader = new window.FileReader();
  reader.readAsDataURL(blob);
  reader.onloadend = () => resolve(reader.result.split(',')[1]); // remove metadata of base64
});

describe('PostManager/uploadImage.js', () => {
  let image;
  before(() => fetch('http://placehold.it/120x120&text=image1')
    .then(response => response.blob())
    .then((blob) => {
      image = blob;
    }));

  it('should success to upload image into S3', () =>
    uploadImage('test', image)
    .then(fetch)
    .then(response => response.blob())
    .then(blob => Promise.all([convertBase64ToBase64(image), convertBase64ToBase64(blob)]))
    .then(results => (
      results[0] === results[1]
      ? Promise.resolve()
      : Promise.reject('uploaded image is not the same with what you uploaded.')))
  );
});
