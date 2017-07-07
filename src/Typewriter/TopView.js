import Commonmark from 'commonmark';

import findBoundElement from './findBoundElement';
import findPriorElement from './findPriorElement';

const reader = new Commonmark.Parser();
const writer = new Commonmark.HtmlRenderer({ sourcepos: true });

export default class TopView {
  constructor(wrapperElement) {
    const topView = document.createElement('div');
    topView.id = 'top-view';
    wrapperElement.appendChild(topView);
    this.topView = topView;

    const topViewContent = document.createElement('div');
    topViewContent.id = 'top-view-content';
    topView.appendChild(topViewContent);
    this.topViewContent = topViewContent;
  }
  update({
    cursorLine,
    text,
  }) {
    const node = reader.parse(text);
    const html = writer.render(node);
    this.topViewContent.innerHTML = html;

    const boundElement = findBoundElement(cursorLine, this.topViewContent);
    if (boundElement) {
      boundElement.scrollIntoView(false);
    } else {
      const priorElement = findPriorElement(cursorLine, this.topViewContent);
      const emptyParagraph = document.createElement('p');
      if (priorElement) {
        priorElement.parentElement.insertBefore(emptyParagraph, priorElement.nextSibling);
      } else {
        const firstChildElement = this.topViewContent.children[0];
        this.topViewContent.insertBefore(emptyParagraph, firstChildElement);
      }
      emptyParagraph.scrollIntoView(false);
    }
  }
}
