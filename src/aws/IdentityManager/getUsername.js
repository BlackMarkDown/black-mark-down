import getSessionValidUser from './getSessionValidUser';

export default function getUsername() {
  return getSessionValidUser()
  .then(user => user.getUsername());
}
