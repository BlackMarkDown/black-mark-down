import isDeleteEvent, { DELETE, BACKSPACE } from './isDeleteEvent';

export default function onDelete({
//  containerElement,
  event,
  start,
  end,
  text,
} = {}) {
  if (!isDeleteEvent(event)) {
    return {
      start,
      end,
      text,
    };
  }

  let deleteLeftOffset;
  let deleteRightOffset;
  if (start === end) {
    if (event.key === DELETE) {
      deleteLeftOffset = start;
      deleteRightOffset =
        text[end] === '\n' && text[end + 1] === '\n'
        ? end + 2
        : end + 1;
    } else if (event.key === BACKSPACE) {
      deleteLeftOffset =
        text[start - 1] === '\n' && text[start - 2] === '\n'
        ? start - 2
        : start - 1;
      deleteRightOffset = end;
    } else {
      throw new Error('Unhandled delete event');
    }
  } else {
    deleteLeftOffset = Math.min(start, end);
    deleteRightOffset = Math.max(start, end);
  }
  const newText = `${text.substr(0, deleteLeftOffset)}${text.substr(deleteRightOffset)}`;

  return {
    start: deleteLeftOffset,
    end: deleteLeftOffset,
    text: newText,
  };
}
