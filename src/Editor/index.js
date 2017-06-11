import elementToMarkdown from './elementToMarkdown';
import expand from './expand';
import restoreSelection from './restoreSelection';
import getStartAndEndIndexes from './getStartAndEndIndexes';
import render from './render';

function isDeleteEvent(event) {
  const keys = ['Backspace', 'Delete'];
  return event && keys.includes(event.key);
}

export default class Editor {
  constructor(element) {
    this.element = element;

    element.addEventListener('keydown', (event) => {
      if (isDeleteEvent(event)) {
        event.preventDefault();
      }
      setTimeout(() => this.update(event));
    });
    element.addEventListener('mouseup', (event) => {
      setTimeout(() => this.update(event));
    });
    this.update();
  }
  update(event) {
    // NOTE: Should get indexes before reseting innerHTML
    // because Selection would be destroyed after reseting innerHTML
    let {
      start,
      end,
    } = getStartAndEndIndexes(this.element);

    let text = elementToMarkdown(this.element);

    if (isDeleteEvent(event)) {
      let deleteLeftOffset;
      let deleteRightOffset;
      if (start === end) {
        if (event.key === 'Delete') {
          deleteLeftOffset = start;
          deleteRightOffset =
            text[end] === '\n' && text[end + 1] === '\n'
            ? end + 2
            : end + 1;
        } else if (event.key === 'Backspace') {
          deleteLeftOffset =
            text[start] === '\n' && text[start - 1] === '\n'
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
      text = `${text.substr(0, deleteLeftOffset)}${text.substr(deleteRightOffset)}`;
      start = end = deleteLeftOffset;
    }

    const renderedHTML = text.split('\n').map(line =>
      `<span class="md-line">${render(line) || '<br>'}</span>`
    ).join('');

    this.element.innerHTML = renderedHTML;
    expand(this.element, start, end);
    restoreSelection(this.element, start, end);
  }
}
