import AWS from 'aws-sdk';
import { getDocumentClients } from '../documentClients';

function queryMyFiles(filterExpression, expressionAttributeValues) {
  const {
    fileDocumentClient,
  } = getDocumentClients();

  const param = {
    Index: 'userID',
    KeyConditionExpression: 'userID = :userID',
    FilterExpression: filterExpression,
    ExpressionAttributeValues: {
      ':userID': AWS.config.credentials.identityId,
      ...expressionAttributeValues,
    },
  };

  return fileDocumentClient.query(param)
  .promise()
  .then(result => (result.Items || []));
}

export default queryMyFiles;
