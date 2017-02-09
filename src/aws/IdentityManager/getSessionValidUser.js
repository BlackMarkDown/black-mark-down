import userPool from './userPool';

const getSessionValidUser = () => new Promise((resolve, reject) => {
  const cognitoUser = userPool.getCurrentUser();
  if (!cognitoUser) {
    return reject('No current user');
  }

  return cognitoUser.getSession((err, session) => {
    if (err) {
      return reject(err);
    }
    if (!session.isValid()) {
      return reject('Session is not valid');
    }
    return resolve(cognitoUser);
  });
});

export default getSessionValidUser;
