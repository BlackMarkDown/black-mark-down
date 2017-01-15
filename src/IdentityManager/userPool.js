import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
  ClientId: process.env.AWS_COGNITO_APP_ID,
};
const userPool = new CognitoUserPool(poolData);

const getCurrentSessionValidUser = () => new Promise((resolve, reject) => {
  const cognitoUser = userPool.getCurrentUser();
  if (!cognitoUser) {
    throw new Error('userPool.getCurrentUser() == null');
  }

  cognitoUser.getSession((err, session) => {
    if (err) {
      return reject(err);
    }
    if (!session.isValid()) {
      return reject('session is not valid');
    }
    return resolve(cognitoUser);
  });
});

userPool.getCurrentSessionValidUser = getCurrentSessionValidUser;

export default userPool;
