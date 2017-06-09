import expand from './expand';
import getNodeAndOffset from './getNodeAndOffset';
import getStartAndEndIndexes from './getStartAndEndIndexes';
import render from './render';

function restoreSelection(containerElement, start, end) {
  const selection = window.getSelection();
  selection.removeAllRanges();

  const {
    node: startNode,
    offset: startOffset,
  } = getNodeAndOffset(containerElement, start);
  const {
    node: endNode,
    offset: endOffset,
  } = getNodeAndOffset(containerElement, end);

  const range = document.createRange();
  range.setStart(startNode, startOffset);
  selection.addRange(range);
  selection.extend(endNode, endOffset);
}

const editorEvent = {
  DEFAULT: 'default',
  DELETE: 'delete',
};

export default class Editor {
  constructor(element) {
    this.element = element;
    this.selectionchangeByKey = false;
    element.addEventListener('keydown', (event) => {
      this.selectionchangeByInput = true;
      if (event.key === 'Backspace' || event.key === 'Delete') {
        event.preventDefault();
        setTimeout(() => this.update(editorEvent.DELETE));
        return;
      }
      setTimeout(() => this.update(editorEvent.DEFAULT));
    });
    element.addEventListener('mousedown', () => {
      this.isMouseDown = true;
      setTimeout(() => this.update(editorEvent.DEFAULT));
    });
    element.addEventListener('mousemove', () => {
      if (this.isMouseDown) {
        setTimeout(() => this.update(editorEvent.DEFAULT));
      }
    });
    element.addEventListener('mouseup', () => {
      this.isMouseDown = false;
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
    let text = this.element.innerHTML
      .replace(/<p(.*?)>/g, '\n\n')
      .replace(/<br(.*?)>/g, '\n')
      .replace(/<[^>]*>/g, '');

    if (event === editorEvent.DELETE) {
      const deleteLeftOffset = Math.min(start, end);
      const deleteRightOffset =
        start === end
        ? deleteLeftOffset + 1
        : Math.max(start, end);
      text = `${text.substr(0, deleteLeftOffset)}${text.substr(deleteRightOffset)}`;

      start = end = deleteLeftOffset;
    }
    const renderedHTML = render(text);
    this.element.innerHTML = renderedHTML;
    expand(this.element, start, end);
    restoreSelection(this.element, start, end);
  }
}
