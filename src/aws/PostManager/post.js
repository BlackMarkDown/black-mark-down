import AWS from 'aws-sdk';
import { getBucket } from '../bucket';
import { getDocumentClients } from '../documentClients';

function uploadFileToS3(title, content) {
  return getBucket().upload({
    Key: title,
    Body: content,
    ACL: 'public-read',
  }).promise();
}

function appendNewFileOnTable(title, markdownFileLocation) {
  const {
    userDocumentClient,
  } = getDocumentClients();
  const newFile = {
    title,
    markdownFileLocation,
  };
  const params = {
    Key: { UserID: AWS.config.credentials.identityId },
    ExpressionAttributeNames: {
      '#Files': 'Files',
    },
    ExpressionAttributeValues: {
      ':NewFile': [newFile],
      ':EmptyList': [],
    },
    UpdateExpression: 'SET #Files = list_append(if_not_exists(#Files, :EmptyList), :NewFile)',
  };

  return userDocumentClient.update(params).promise();
}

function post(title, content) {
  return uploadFileToS3(title, content)
  .then(data => appendNewFileOnTable(title, data.Location));
}

export default post;
