import { uploadFileToS3 } from '../bucket';
import { updateFile } from '../documentClients';

function post(fileID, filename, content) {
  return uploadFileToS3(`post-${fileID}`, content)
  .then(markdownFileLocation =>
    updateFile(fileID, {
      ':filename': filename,
      ':markdownFileLocation': markdownFileLocation,
      ':false': false,
      ':true': true,
    }, 'SET filename = :filename, markdownFileLocation = :markdownFileLocation, isEditing = :false, isPublic = :true')
  );
}

export default post;
