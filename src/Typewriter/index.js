import Commonmark from 'commonmark';
import CodeMirror from 'codemirror';

const reader = new Commonmark.Parser();
const writer = new Commonmark.HtmlRenderer({ sourcepos: true });

function getPosition(node) {
  if (node.nodeName === 'PRE') {
    return getPosition(node.children[0]);
  }
  const {
    sourcepos, // #:#-#:#
  } = node.dataset;
  if (!sourcepos) {
    return getPosition(node.parentElement);
  }
  const start = parseInt(sourcepos, 10);
  const dashIndex = sourcepos.indexOf('-');
  const end = parseInt(sourcepos.substring(dashIndex + 1), 10);
  return {
    start,
    end,
  };
}

function findBoundNode(node, line) {
  let previousChild;
  for (let i = 0; i < node.children.length; i += 1) {
    const child = node.children[i];
    if (child.nodeName === 'PRE' || child.dataset.sourcepos) {
      const {
        start,
        end,
      } = getPosition(child);
      if (start <= line && line <= end) {
        return findBoundNode(child, line) || child;
      } else if (line < start) {
        return previousChild;
      }
      previousChild = child;
    }
  }
  return null;
}

function findNextNode(node) {
  return node.nextElementSibling
  ? node.nextElementSibling
  : findNextNode(node.parentElement);
}

export default class Editor {
  constructor(element) {
    this.element = element;

    const topView = document.createElement('div');
    topView.id = 'top-view';
    element.appendChild(topView);
    this.topView = topView;

    const topViewContent = document.createElement('div');
    topViewContent.id = 'top-view-content';
    topView.appendChild(topViewContent);
    this.topViewContent = topViewContent;

    const codeEditor = document.createElement('code-editor');
    codeEditor.id = 'code-editor';
    element.appendChild(codeEditor);

    const bottomView = document.createElement('div');
    bottomView.id = 'bottom-view';
    element.appendChild(bottomView);
    this.bottomView = bottomView;

    const bottomViewContent = document.createElement('div');
    bottomViewContent.id = 'bottom-view-content';
    bottomView.appendChild(bottomViewContent);
    this.bottomViewContent = bottomViewContent;

    const codeMirror = new CodeMirror(codeEditor, {
      scrollbarStyle: null,
      lineWrapping: true,
      // lineNumbers: true,
    });
    this.codeMirror = codeMirror;

    this.previousScrollTop = 0;


    fetch('https://raw.githubusercontent.com/markdown-it/markdown-it/master/README.md')
    .then(response => response.text())
    .then((text) => {
      this.codeMirror.setValue(text);
      this.codeMirror.setCursor({
        line: 0,
        ch: 0,
      });
      this.codeMirror.on('cursorActivity', () => {
        const {
          line,
        } = this.codeMirror.getCursor();
        this.updateBottomView(line + 1);
        this.updateCodeMirror(line + 1);
        this.updateTopView(line + 1);
      });
    });
  }
  updateTopView(cursorLine) {
    const text = this.codeMirror.getValue();
    const node = reader.parse(text);
    const html = writer.render(node);
    this.topViewContent.innerHTML = html;
    const boundNode = findBoundNode(this.topViewContent, cursorLine);
    boundNode.scrollIntoView(false);
  }
  updateBottomView(cursorLine) {
    const text = this.codeMirror.getValue();
    const node = reader.parse(text);
    const html = writer.render(node);
    this.bottomViewContent.innerHTML = html;
    const boundNode = findBoundNode(this.bottomViewContent, cursorLine);
    const nextNode = findNextNode(boundNode);
    nextNode.scrollIntoView(true);
  }
  updateCodeMirror(cursorLine) {
    // NOTE Assume that bottom view already updated
    const boundNode = findBoundNode(this.bottomViewContent, cursorLine);
    const nextNode = findNextNode(boundNode);
    const start = getPosition(boundNode).start;
    const end = getPosition(nextNode).start;

    let height = 0;
    for (let i = start; i < end; i += 1) {
      const line = this.codeMirror.getLineHandle(i - 1);
      height += line.height;
    }
    const wrapperElement = this.codeMirror.getWrapperElement();
    wrapperElement.parentElement.style.height = `${height}px`;
    wrapperElement.style.height = `${height}px`;

    let scrollTop = 6; // border
    for (let i = 0; i < start - 1; i += 1) {
      const line = this.codeMirror.getLineHandle(i);
      scrollTop += line.height;
    }

    this.codeMirror.scrollTo(0, scrollTop);

    const {
      top: cursorTop,
    } = this.codeMirror.cursorCoords(true, 'page');
    const deltaY = cursorTop - 200 - (scrollTop - this.previousScrollTop);
    const currentHeight = parseFloat(window.getComputedStyle(this.topView).height, 10);
    this.topView.style.height = `${currentHeight - deltaY}px`;

    this.previousScrollTop = scrollTop;
    window.codeMirror = this.codeMirror;
  }
}
