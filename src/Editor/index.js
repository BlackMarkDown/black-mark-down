import elementToMarkdown from './elementToMarkdown';
import expand from './expand';
import restoreSelection from './restoreSelection';
import getStartAndEndIndexes from './getStartAndEndIndexes';
import render from './render';

function isDeleteEvent(event) {
  const keys = ['Backspace', 'Delete'];
  return keys.includes(event.key);
}

export default class Editor {
  constructor(element) {
    this.element = element;
    element.addEventListener('keydown', (event) => {
      if (isDeleteEvent(event)) {
        event.preventDefault();
      } else if (event.key === 'Enter') {
        event.preventDefault();
        if (event.shiftKey) { // asdf \n asdf 에서 앞엣줄에서 쉬프트 엔터 누르면 이상해짐
          document.execCommand('insertText', false, '\n');
        } else {
          document.execCommand('insertText', false, '\n\n');
        }
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
          deleteRightOffset = end + 1;
        } else if (event.key === 'Backspace') {
          deleteLeftOffset = start - 1;
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

    const renderedHTML = text.split('\n\n').map(paragraph =>
      `<p>${paragraph.split('\n')
        .map(inlineText => `<span class="md-line">${render(inlineText)}</span>`)
        .join('')}</p>`
    ).join('');

    this.element.innerHTML = renderedHTML;
    expand(this.element, start, end);
    restoreSelection(this.element, start, end);
  }
}
