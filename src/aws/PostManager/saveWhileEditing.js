import AWS from 'aws-sdk';
import { getDocumentClients } from '../documentClients';
import { uploadFileToS3 } from '../bucket';

export default function saveWhileEditing(fileID, filename, content) {
  return uploadFileToS3(`edit-${fileID}`, content)
  .then((markdownFileLocation) => {
    const {
      fileDocumentClient,
    } = getDocumentClients();
    const newEditingData = {
      filename,
      markdownFileLocation,
    };
    const params = {
      Key: {
        ID: fileID,
        userID: AWS.config.credentials.identityId,
      },
      ExpressionAttributeValues: {
        ':newEditingData': newEditingData,
      },
      UpdateExpression: 'SET editingData = :newEditingData',
    };

    return fileDocumentClient.update(params).promise();
    // TODO return updated file data from table
  });
}
