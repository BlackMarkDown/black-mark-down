import logIn from './logIn';

export default function completeNewPasswordChallenge(username, oldPassword, newPassword) {
  return new Promise((resolve, reject) => {
    logIn(username, oldPassword, {
      newPasswordRequired: (userAttributes, requiredAttributes, cognitoUser) => {
        cognitoUser.completeNewPasswordChallenge(newPassword, userAttributes, {
          onSuccess: resolve,
          onFailure: reject,
        });
      },
    });
  });
}
