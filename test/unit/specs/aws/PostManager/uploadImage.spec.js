/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

import 'whatwg-fetch';
import uploadImage from 'src/aws/PostManager/uploadImage';
import imageBlob from './imageBlob';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

const convertBase64ToBase64 = blob => new Promise((resolve) => {
  const reader = new window.FileReader();
  reader.readAsDataURL(blob);
  reader.onloadend = () => resolve(reader.result.split(',')[1]); // remove metadata of base64
});

describe.skip('PostManager/uploadImage.js', () => {
  it('should success to upload image into S3', () =>
    uploadImage('test', imageBlob)
    .then(fetch)
    .then(checkStatus)
    .then(response => response.blob())
    .then(blob => Promise.all([convertBase64ToBase64(imageBlob), convertBase64ToBase64(blob)]))
    .then(results => (
      results[0] === results[1]
      ? Promise.resolve()
      : Promise.reject('uploaded image is not the same with what you uploaded.')))
  );
});
