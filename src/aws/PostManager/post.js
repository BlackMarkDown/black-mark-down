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

function appendNewFileOnTable(markdownFileLocation) {
  const {
    userDocumentClient,
  } = getDocumentClients();
  const newFile = {
    MarkdownFileLocation: markdownFileLocation,
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
  .then(data => appendNewFileOnTable(data.Location));
}

export default post;
