import expand from './expand';
import getRange from './getRange';
import getStartAndEndIndexes from './getStartAndEndIndexes';
import render from './render';

function restoreSelection(containerElement, range) {
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}


export default class Editor {
  constructor(element) {
    this.element = element;
    element.addEventListener('keyup', () => this.update());
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
    const range = getRange(this.element, start, end);
    expand(range);
    restoreSelection(this.element, range);
  }
}
