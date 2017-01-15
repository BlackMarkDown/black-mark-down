import AWS from 'aws-sdk';

AWS.config.region = process.env.AWS_REGION;

let userTable;

export function refreshTable() {
  userTable = new AWS.DynamoDB({ params: { TableName: 'User' } });
}
refreshTable();

export function getTables() {
  return {
    userTable,
  };
}
