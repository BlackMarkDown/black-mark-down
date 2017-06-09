import findBiggestInlineWrapper from './findBiggestInlineWrapper';
import treeWalk from './treeWalk';

function findOffset(containerElement, targetNode, innerOffset) {
  return treeWalk(containerElement, (node, offset) => {
    if (node === targetNode) {
      switch (node.nodeName) {
        case '#text':
          return offset + innerOffset;
        default:
          return offset;
      }
    }
    return null;
  });
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
