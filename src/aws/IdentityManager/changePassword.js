import userPool from './userPool';

export default function changePassword(oldPassword, newPassword) {
  return new Promise((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.changePassword(oldPassword, newPassword, (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    }
    return reject();
  });
}
