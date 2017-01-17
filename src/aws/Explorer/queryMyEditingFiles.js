import queryMyFiles from './queryMyFiles';

export default function queryMyEditingFiles() {
  return queryMyFiles('isEditing = :true', {
    ':true': true,
  });
}
