import findBiggestInlineWrapper from './findBiggestInlineWrapper';

function findOffset(containerElement, targetNode, innerOffset) {
  /* eslint no-bitwise: ["error", { "allow": ["|"] }] */
  const walker = document.createTreeWalker(containerElement,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  let index = 0;
  let node = walker.nextNode();
  while (node) {
    const {
      nodeName,
      length,
    } = node;
    if (node === targetNode) {
      return index + innerOffset;
    }
    if (nodeName === '#text') {
      index += length;
    } else if (nodeName === 'BR') {
      index += 1;
    } else if (nodeName === 'P') {
      index += 2;
    }
    node = walker.nextNode();
  }
  throw new Error('No node');
}

export default function getStartAndEndIndexes(containerElement) {
  const selection = window.getSelection();
  const {
    anchorNode,
    anchorOffset,
    focusNode,
    focusOffset,
  } = selection;
  let start = findOffset(containerElement, anchorNode, anchorOffset);
  let end = findOffset(containerElement, focusNode, focusOffset);

  if (anchorNode.textContent.length === anchorOffset) {
    const wrapperNode = findBiggestInlineWrapper(anchorNode);
    if (wrapperNode && !wrapperNode.classList.contains('md-expand')) {
      const offset = findOffset(containerElement, wrapperNode.lastChild, 0);
      if (offset === start) {
        start += wrapperNode.lastChild.textContent.length;
      }
    }
  }
  if (focusNode.textContent.length === focusOffset) {
    const wrapperNode = findBiggestInlineWrapper(focusNode);
    if (wrapperNode && !wrapperNode.classList.contains('md-expand')) {
      const offset = findOffset(containerElement, wrapperNode.lastChild, 0);
      if (offset === end) {
        end += wrapperNode.lastChild.textContent.length;
      }
    }
  }

  return {
    start,
    end,
  };
}
