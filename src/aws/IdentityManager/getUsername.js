let username;
export function refreshUsername(newUsername) {
  username = newUsername;
}

export default function getUsername() {
  return username;
}
