import queryMyFiles from './queryMyFiles';

export default function queryMyPostedFiles() {
  return queryMyFiles('isPublic = :true', {
    ':true': true,
  });
}
