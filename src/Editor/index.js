import expand from './expand';
import getNodeAndOffset from './getNodeAndOffset';
import getStartAndEndIndexes from './getStartAndEndIndexes';
import render from './render';

function restoreSelection(containerElement, start, end) {
  const sel = window.getSelection();
  sel.removeAllRanges();

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
  sel.addRange(range);
  sel.extend(endNode, endOffset);
}

export default class Editor {
  constructor(element) {
    this.element = element;
    this.selectionchangeByKey = false;
    document.addEventListener('selectionchange', () => {
      if (this.selectionchangeByInput) {
        this.selectionchangeByInput = false;
        this.update();
      }
    });
    element.addEventListener('keydown', () => {
      this.selectionchangeByInput = true;
    });
    element.addEventListener('mousedown', () => {
      this.isMouseDown = true;
      this.selectionchangeByInput = true;
    });
    element.addEventListener('mousemove', () => {
      this.selectionchangeByInput = true;
    });
    element.addEventListener('mouseup', () => {
      this.isMouseDown = false;
    });
    this.update();
  }
  update() {
    const textContent = this.element.innerHTML.replace(/<[^>]*>/g, '');
    const renderedHTML = render(textContent);
    const {
      start,
      end,
    } = getStartAndEndIndexes(this.element);

    this.element.innerHTML = `${renderedHTML}`;
    expand(this.element, start, end);
    restoreSelection(this.element, start, end);
  }
}
