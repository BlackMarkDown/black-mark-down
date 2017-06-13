export const BACKSPACE = 'Backspace';
export const DELETE = 'Delete';

export default function isDeleteEvent(event) {
  const keys = [BACKSPACE, DELETE];
  return event && keys.includes(event.key);
}
