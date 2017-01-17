import AWS from 'aws-sdk';

AWS.config.region = process.env.AWS_REGION;

let userDocumentClient;
let fileDocumentClient;

const generateDocumentClient =
  tableName => new AWS.DynamoDB.DocumentClient({ params: { TableName: tableName } });

export function refreshDocumentClients() {
  userDocumentClient = generateDocumentClient('User');
  fileDocumentClient = generateDocumentClient('File');
}
refreshDocumentClients();

export function getDocumentClients() {
  return {
    userDocumentClient,
    fileDocumentClient,
  };
}

export function updateFile(fileID, expressionAttributeValues, updateExpression) {
  const params = {
    Key: {
      ID: fileID,
      userID: AWS.config.credentials.identityId,
    },
    ExpressionAttributeValues: {
      ...expressionAttributeValues,
    },
    UpdateExpression: updateExpression,
  };

  return fileDocumentClient.update(params).promise();
}
