import AWS from 'aws-sdk';
import { getTables } from '../table';

function getMyFiles() {
  const {
    userTable,
  } = getTables();

  const param = {
    AttributesToGet: ['Files'],
    Key: {
      UserID: {
        S: AWS.config.credentials.identityId,
      },
    },
  };
  return userTable.getItem(param)
  .promise()
  .then(result => (
    result.Item && result.Item.Files && result.Item.Files.L
    ? result.Item.Files.L
    : []));
}

export default getMyFiles;
