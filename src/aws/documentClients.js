import AWS from 'aws-sdk';

AWS.config.region = process.env.AWS_REGION;

let userDocumentClient;

export function refreshDocumentClients() {
  userDocumentClient = new AWS.DynamoDB.DocumentClient({ params: { TableName: 'User' } });
}
refreshDocumentClients();

export function getDocumentClients() {
  return {
    userDocumentClient,
  };
}
