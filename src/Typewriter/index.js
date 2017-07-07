import TopView from './TopView';
import BottomView from './BottomView';
import CodeEditor from './CodeEditor';

export default class Typewriter {
  constructor(element) {
    this.element = element;
    this.topView = new TopView(element);
    this.codeEditor = new CodeEditor(element);
    this.bottomView = new BottomView(element);
    this.codeEditor.codeMirror.on('cursorActivity', () => {
      const {
        line,
      } = this.codeEditor.codeMirror.getCursor();
      const text = this.codeEditor.codeMirror.getValue();

      const data = {
        cursorLine: line,
        text,
      };
      // update reversely because of scrolling
      this.bottomView.update(data);
      this.codeEditor.update(data);
      this.topView.update(data);
    });
  }
}
