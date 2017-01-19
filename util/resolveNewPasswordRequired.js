const env = require('../config/dev.env');

Object.keys(env).forEach((key) => {
  env[key] = eval(`(${env[key]})`);
});

process.env = {
  ...process.env,
  ...env,
};

const IdentityManager = require('../src/aws/IdentityManager').default;

const [
  ,
  ,
  username,
  oldPassword,
  newPassword,
] = process.argv;

if (process.argv.length < 5) {
  console.log('command: npm run changePassword {username} {oldPassword} {newPassword}');
} else {
  IdentityManager.completeNewPasswordChallenge(username, oldPassword, newPassword)
  .then(() => {
    console.log('Success');
  })
  .catch((err) => {
    console.log(err);
  });
}
