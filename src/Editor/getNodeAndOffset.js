// TODO rename this function into 'getNodeAndInnerOffset'
import treeWalk from './treeWalk';

export default function getNodeAndOffset(containerElement, targetOffset) {
  return treeWalk(containerElement, (node, offset) => {
    const length = node.length || 0;
    if (targetOffset >= offset
      && targetOffset <= offset + length) {
      switch (node.nodeName) {
        case '#text':
          return {
            node,
            offset: targetOffset - offset,
          };
        default:
          return {
            node,
            offset: 0,
          };
      }
    }
    return null;
  });
}

/*
export default function getNodeAndOffset(containerElement, index) {
  const walker = document.createTreeWalker(containerElement,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  let currentIndex = -2;
  let node = walker.nextNode();
  while (node) {
    const {
      nodeName,
    } = node;
    if (nodeName === '#text'
      || nodeName === 'BR'
      || nodeName === 'P') {
      let length;
      switch (nodeName) {
        case '#text':
          length = node.length;
          break;
        case 'BR':
          length = 1;
          break;
        case 'P':
          length = 2;
          break;
        default:
          length = 0;
      }
      if (index >= currentIndex
        && index <= currentIndex + length) {
        switch (nodeName) {
          case '#text':
            return {
              node,
              offset: index - currentIndex,
            };
          case 'P':
            return {
              node,
              offset: 0,
            };
          default:
        }
      }
      currentIndex += length;
    }
    node = walker.nextNode();
  }
  throw new Error('No node');
}*/
