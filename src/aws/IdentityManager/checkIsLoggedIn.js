import getSessionValidUser from './getSessionValidUser';

export default function checkIsLoggedIn() {
  return getSessionValidUser()
  .then(() => true)
  .catch((err) => {
    console.log(err);
    return false;
  });
}
