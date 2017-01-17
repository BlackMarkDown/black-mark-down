import { uploadFileToS3 } from '../bucket';
import { updateFile } from '../documentClients';

function post(fileID, title, content) {
  return uploadFileToS3(`post-${fileID}`, content)
  .then(markdownFileLocation =>
    updateFile(fileID, {
      ':title': title,
      ':markdownFileLocation': markdownFileLocation,
      ':false': false,
      ':true': true,
    }, 'SET title = :title, markdownFileLocation = :markdownFileLocation, isEditing = :false, isPublic = :true')
  );
}

export default post;
