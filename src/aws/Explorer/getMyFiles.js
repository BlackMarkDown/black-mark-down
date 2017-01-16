import AWS from 'aws-sdk';
import { getDocumentClients } from '../documentClients';

function getMyFiles() {
  const {
    userDocumentClient,
  } = getDocumentClients();

  const param = {
    AttributesToGet: ['Files'],
    Key: {
      UserID: AWS.config.credentials.identityId,
    },
  };

  return userDocumentClient.get(param)
  .promise()
  .then(result => (
    result.Item && result.Item.Files
    ? result.Item.Files
    : []));
}

export default getMyFiles;
