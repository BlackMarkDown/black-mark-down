import ObjectType from '../Explorer/ObjectType';
import createObjectIfNotExists from '../Explorer/createObjectIfNotExists';

function fileToText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const ret = e.currentTarget.result;
      console.log(e.currentTarget.result, ret.length);
      resolve(ret);
    };
    reader.readAsArrayBuffer(file);
  });
}

/**
  * @return Promise that return file path
  */
export default function uploadImage(filename, file) {
  return createObjectIfNotExists(filename, ObjectType.IMAGE_FILE, file);
  //return fileToText(file)
  //.then(result => createObjectIfNotExists(filename, ObjectType.IMAGE_FILE, result));
}
