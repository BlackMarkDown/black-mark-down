import Commonmark from 'commonmark';
import CodeMirror from 'codemirror';

const reader = new Commonmark.Parser();
const writer = new Commonmark.HtmlRenderer({ sourcepos: true });

function findBoundNode(node, line) {
  for (let i = 0; i < node.childNodes.length; i += 1) {
    const child = node.childNodes[i];
    if (child.dataset && child.dataset.sourcepos) {
      const sourcepos = child.dataset.sourcepos; // #:#-#:#
      const start = parseInt(sourcepos, 10);
      const dashIndex = sourcepos.indexOf('-');
      const end = parseInt(sourcepos.substring(dashIndex + 1), 10);
      if (start <= line && line <= end) {
        return findBoundNode(child, line) || child;
      } else if (line < start) {
        return null;
      }
    }
  }
  return null;
}

export default class Editor {
  constructor(element) {
    this.element = element;

    const upperView = document.createElement('div');
    upperView.id = 'upper-view';
    element.appendChild(upperView);
    this.upperView = upperView;

    const upperViewContent = document.createElement('div');
    upperViewContent.id = 'upper-view-content';
    upperView.appendChild(upperViewContent);
    this.upperViewContent = upperViewContent;

    const codeEditor = document.createElement('code-editor');
    codeEditor.id = 'code-editor';
    element.appendChild(codeEditor);

    const codeMirror = new CodeMirror(codeEditor, {
      scrollbarStyle: null,
      lineWrapping: true,
      lineNumbers: true,
    });
    this.codeMirror = codeMirror;


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
        this.updateUpperView(line + 1);
      });
    });
  }
  updateUpperView(cursorLine) {
    const text = this.codeMirror.getValue();
    const node = reader.parse(text);
    const html = writer.render(node);
    this.upperViewContent.innerHTML = html;
    const boundNode = findBoundNode(this.upperViewContent, cursorLine);
    boundNode.scrollIntoView(false);
  }
}
