import Commonmark from 'commonmark';

import findNextElementOfLine from './findNextElementOfLine';

const reader = new Commonmark.Parser();
const writer = new Commonmark.HtmlRenderer({ sourcepos: true });

export default class BottomView {
  constructor(wrapperElement) {
    const bottomView = document.createElement('div');
    bottomView.id = 'bottom-view';
    wrapperElement.appendChild(bottomView);
    this.bottomView = bottomView;

    const bottomViewContent = document.createElement('div');
    bottomViewContent.id = 'bottom-view-content';
    bottomView.appendChild(bottomViewContent);
    this.bottomViewContent = bottomViewContent;
  }
  update({
    cursorLine,
    text,
  }) {
    const node = reader.parse(text);
    const html = writer.render(node);
    this.bottomViewContent.innerHTML = html;
    const nextElement = findNextElementOfLine(cursorLine, this.bottomViewContent);
    if (nextElement) {
      nextElement.scrollIntoView(true);
    } else {
      this.bottomView.scrollTop = this.bottomViewContent.scrollHeight;
    }
  }
}
