import Commonmark from 'commonmark';
import CodeMirror from 'codemirror';

const reader = new Commonmark.Parser();

function findBoundNode(cursorLine, rootNode) {
  const walker = rootNode.walker();
  let minEnd = Number.POSITIVE_INFINITY;
  let boundNode;
  let event = walker.next();
  while (event) {
    const node = event.node;
    if (event.entering && node.sourcepos && node.type !== 'document') {
      const start = node.sourcepos[0][0] - 1;
      const end = node.sourcepos[1][0] - 1;
      if (start <= cursorLine && cursorLine <= end && end <= minEnd) {
        minEnd = end;
        boundNode = node;
      }
    }
    event = walker.next();
  }
  return boundNode;
}
function findNextNode(targetNode, rootNode) {
  const node = targetNode.next;
  if (node) {
    return node.sourcepos
      ? node
      : findNextNode(node, rootNode);
  }
  const { parent } = targetNode;
  if (parent.type === 'document' || parent.type === rootNode) {
    return null;
  }
  return findNextNode(parent);
}
function findNextNodeOfLine(cursorLine, rootNode) {
  const walker = rootNode.walker();
  let minEnd = Number.POSITIVE_INFINITY;
  let boundNode;
  let event = walker.next();
  while (event) {
    const node = event.node;
    if (event.entering && node.sourcepos && node.type !== 'document') {
      const end = node.sourcepos[1][0] - 1;
      if (cursorLine <= end && end <= minEnd) {
        minEnd = end;
        boundNode = node;
      }
    }
    event = walker.next();
  }
  return boundNode;
}

function findPriorNode(cursorLine, rootNode) {
  const walker = rootNode.walker();
  let maxMin = 0;
  let priorNode;
  let event = walker.next();
  while (event) {
    const node = event.node;
    if (event.entering && node.sourcepos && node.type !== 'document') {
      const end = node.sourcepos[1][0] - 1;
      if (maxMin <= end && end <= cursorLine) {
        maxMin = end;
        priorNode = node;
      }
    }
    event = walker.next();
  }
  return priorNode;
}

export default class BottomView {
  constructor(wrapperElement) {
    const codeEditor = document.createElement('code-editor');
    codeEditor.id = 'code-editor';
    wrapperElement.appendChild(codeEditor);
    const codeMirror = new CodeMirror(codeEditor, {
      scrollbarStyle: null,
      lineWrapping: true,
      // lineNumbers: true,
    });
    this.codeMirror = codeMirror;
    window.codeMirror = codeMirror; // for debuging
  }
  update({
    cursorLine,
    text,
  }) {
    const {
      start,
      end,
    } = this.getBoundRange(text, cursorLine);
    let height = 6;
    for (let i = start; i <= end; i += 1) {
      const line = this.codeMirror.getLineHandle(i);
      height += line.height;
    }
    const wrapperElement = this.codeMirror.getWrapperElement();
    wrapperElement.parentElement.style.height = `${height}px`;
    wrapperElement.style.height = `${height}px`;

    let scrollTop = 6; // border
    for (let i = 0; i < start; i += 1) {
      const line = this.codeMirror.getLineHandle(i);
      scrollTop += line.height;
    }

    this.codeMirror.scrollTo(0, scrollTop);
  }
  getBoundRange(text, cursorLine) {
    const rootNode = reader.parse(text);
    const boundNode = findBoundNode(cursorLine, rootNode);
    const startNode = boundNode || findPriorNode(cursorLine, rootNode);
    let start;
    if (boundNode) {
      start = boundNode.sourcepos[0][0] - 1;
    } else if (startNode) { // PriorNode
      start = (startNode.sourcepos[1][0] - 1) + 1;
    } else {
      start = 0;
    }
    const nextNode = startNode
      ? findNextNode(startNode, rootNode)
      : findNextNodeOfLine(cursorLine, rootNode);
    const end = nextNode
      ? (nextNode.sourcepos[0][0] - 1) - 1
      : this.codeMirror.lineCount() - 1;
    return {
      start,
      end,
    };
  }
}
