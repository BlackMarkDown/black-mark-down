import elementToMarkdown from './elementToMarkdown';
import expand from './expand';
import restoreSelection from './restoreSelection';
import getStartAndEndIndexes from './getStartAndEndIndexes';
import onDelete from './onDelete';
import isDeleteEvent from './isDeleteEvent';
import render from './render';

export default class Editor {
  constructor(element) {
    this.element = element;

    element.addEventListener('keydown', (event) => {
      if (isDeleteEvent(event)) {
        event.preventDefault();
      }
      /*
      if (event.key === 'Enter' && event.shiftKey) {
        event.preventDefault();
        document.execCommand('insertHTML', false, '\n');
      }*/
      setTimeout(() => this.update(event));
    });
    element.addEventListener('mouseup', (event) => {
      setTimeout(() => this.update(event));
    });
    this.update();
  }
  update(event) {
    let text = elementToMarkdown(this.element);

    if (text) {
      const rendered = render(text);
      const cloned = this.element.cloneNode();
      cloned.innerHTML = rendered;
      const reMarkdown = elementToMarkdown(cloned);

      console.log('\n\n\n\n\n\n\n\n\n\n');
      console.log('text', text === reMarkdown);
      console.log(this.element.innerHTML);
      console.log(text, text.length);
      console.log(rendered);
      console.log(reMarkdown, reMarkdown.length);
    }

    // NOTE: Should get indexes before reseting innerHTML
    // because Selection would be destroyed after reseting innerHTML
    let {
      start,
      end,
    } = getStartAndEndIndexes(this.element);
    console.log(start, end);

    ({
      start,
      end,
      text,
    } = onDelete({
      containerElement: this.element,
      event,
      start,
      end,
      text,
    }));

    const renderedHTML = render(text);
    this.element.innerHTML = renderedHTML;
    expand(this.element, start, end);
    restoreSelection(this.element, start, end);
  }
}
