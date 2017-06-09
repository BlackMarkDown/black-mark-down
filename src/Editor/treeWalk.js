export default function treeWalk(containerElement, callback) {
  /* eslint no-bitwise: ["error", { "allow": ["|"] }] */
  const walker = document.createTreeWalker(containerElement,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  let offset = 0;
  let node = walker.nextNode();
  let isFirstParagraph = true;
  let isFirstLine = true;
  while (node) {
    const {
      nodeName,
      length,
    } = node;

    switch (nodeName) {
      case 'P':
        isFirstLine = true;
        if (isFirstParagraph) {
          isFirstParagraph = false;
          break;
        }
        offset += 2;
        break;
      case 'SPAN':
        if (node.classList.contains('md-line')) {
          if (isFirstLine) {
            isFirstLine = false;
            break;
          }
          offset += 1;
        }
        break;
      default:
        break;
    }

    const ret = callback(node, offset);
    if (ret !== undefined && ret !== null) {
      return ret;
    }


    switch (nodeName) {
      case '#text':
        offset += length;
        break;
      default:
        break;
    }
    node = walker.nextNode();
  }
  throw new Error('No node');
}
