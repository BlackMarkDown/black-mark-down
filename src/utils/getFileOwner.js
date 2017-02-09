export default function getFileOwner(filePath) {
  const indexOfFirstSlash = filePath.indexOf('/');
  if (indexOfFirstSlash < 0) {
    return filePath;
  }
  return filePath.substring(0, indexOfFirstSlash);
}
