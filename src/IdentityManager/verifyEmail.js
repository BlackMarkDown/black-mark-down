import userPool from './userPool';

const verifyEmail = verificationCode => new Promise((resolve, reject) => {
  userPool.getCurrentSessionValidUser()
  .then((cognitoUser) => {
    cognitoUser.verifyAttribute('email', verificationCode, {
      onSuccess: result => resolve(result),
      onFailure: err => reject(err),
    });
  })
  .catch(err => reject(err));
});

export default verifyEmail;
