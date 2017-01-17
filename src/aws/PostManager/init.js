import uuid from 'uuid';
import { updateFile } from '../documentClients';

/**
  * @return Promise that return fileID
  */
export default function init() {
  const newID = uuid();
  return updateFile(newID, {
    ':true': true,
    ':false': false,
  }, 'SET isPublic = :false, isEditing = :true').then(() => newID);
}
