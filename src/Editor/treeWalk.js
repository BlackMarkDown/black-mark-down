const TEXT = '#text';
const SPAN = 'SPAN';
const BR = 'BR';
const P = 'P';

export default function treeWalk(containerElement, callback) {
  /* eslint no-bitwise: ["error", { "allow": ["|"] }] */
  const walker = document.createTreeWalker(containerElement,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  let offset = 0;
  let node = walker.nextNode();
  let isFirstLine = true;
  let isFirstParagraph = true;
  while (node) {
    let markdownContent;
    const {
      nodeName,
    } = node;

    switch (nodeName) {
      case P:
        if (isFirstParagraph) {
          isFirstParagraph = false;
          break;
        }
        markdownContent = '\n\n';
        break;
      case SPAN:
        if (node.classList.contains('md-line')) {
          if (isFirstLine) {
            isFirstLine = false;
            break;
          }
          markdownContent = '\n';
        }
        break;
      case BR:
        if (node.nextSibling) {
          markdownContent = '\n';
        }
        break;
      case TEXT:
        markdownContent = node.textContent;
        break;
      default:
        break;
    }
    if (nodeName !== TEXT) {
      offset += markdownContent ? markdownContent.length : 0;
    }

    const ret = callback(node, offset, markdownContent);
    if (ret !== undefined && ret !== null) {
      return ret;
    }

    if (nodeName === TEXT) {
      offset += markdownContent.length;
    }

    node = walker.nextNode();
  }
  return undefined;
}
