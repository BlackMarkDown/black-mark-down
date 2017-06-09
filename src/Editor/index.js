import expand from './expand';
import getNodeAndOffset from './getNodeAndOffset';
import getStartAndEndIndexes from './getStartAndEndIndexes';
import rerenderHTML from './rerenderHTML';

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

export default class Editor {
  constructor(element) {
    this.element = element;
    this.selectionchangeByKey = false;
    element.addEventListener('keydown', () => {
      this.selectionchangeByInput = true;
      setTimeout(() => this.update());
    });
    element.addEventListener('mousedown', () => {
      this.isMouseDown = true;
      setTimeout(() => this.update());
    });
    element.addEventListener('mousemove', () => {
      if (this.isMouseDown) {
        setTimeout(() => this.update());
      }
    });
    element.addEventListener('mouseup', () => {
      this.isMouseDown = false;
    });
    this.update();
  }
  update() {
    // NOTE: Should get indexes before reseting innerHTML
    // because Selection would be destroyed after reseting innerHTML
    const {
      start,
      end,
    } = getStartAndEndIndexes(this.element);

    rerenderHTML(this.element);
    expand(this.element, start, end);
    restoreSelection(this.element, start, end);
  }
}
