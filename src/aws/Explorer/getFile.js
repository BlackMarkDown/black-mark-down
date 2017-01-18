import AWS from 'aws-sdk';
import { getDocumentClients } from '../documentClients';

function getFile(fileID) {
  const {
    fileDocumentClient,
  } = getDocumentClients();

  const params = {
    Key: {
      userID: AWS.config.credentials.identityId,
      ID: fileID,
    },
  };

  return fileDocumentClient.get(params)
  .promise()
  .then(result => result.Item);
}

export default getFile;
