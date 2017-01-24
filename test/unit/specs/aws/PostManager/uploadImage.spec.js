import uuid from 'uuid';
import PostManager from 'src/aws/PostManager';
import Explorer from 'src/aws/Explorer';
import IdentityManager from 'src/aws/IdentityManager';
import imageBlob from './imageBlob';

const convertBase64ToBase64 = blob => new Promise((resolve) => {
  const reader = new window.FileReader();
  reader.readAsDataURL(blob);
  reader.onloadend = () => resolve(reader.result.split(',')[1]); // remove metadata of base64
});

describe('PostManager/uploadImage.js', () => {
  it('should success to upload image into S3', () =>
    PostManager.uploadImage(`${IdentityManager.getUsername()}/testImage-${uuid()}.png`, imageBlob)
    .then(path => Explorer.getFile(path, Explorer.ObjectType.IMAGE_FILE))
    .then(blob => Promise.all([convertBase64ToBase64(imageBlob), convertBase64ToBase64(blob)]))
    .then(results => (
      results[0] === results[1]
      ? Promise.resolve()
      : Promise.reject('uploaded image is not the same with what you uploaded.')))
  );
});
