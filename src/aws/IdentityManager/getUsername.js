let username;

export function updateUsername(newUsername) {
  username = newUsername;
}

export default function getUsername() {
  return username;
}
