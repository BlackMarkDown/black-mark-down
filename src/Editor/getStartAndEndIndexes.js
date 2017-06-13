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

  if (anchorOffset === 0) {
    const wrapperNode = findBiggestInlineWrapper(anchorNode);
    if (wrapperNode
      && !wrapperNode.classList.contains('md-expand')
      && wrapperNode.firstChild
    ) {
      const frontTokenNode = wrapperNode.firstChild;
      const tokenOffset = findOffset(containerElement, frontTokenNode, 0);
      const tokenLength = frontTokenNode.textContent.length;
      const tokenEndOffset = tokenOffset + tokenLength;
      if (start === tokenEndOffset) {
        start -= tokenLength;
      }
      if (end === tokenEndOffset) {
        end -= tokenLength;
      }
    }
  }
  if (focusNode.textContent.length === focusOffset) {
    const wrapperNode = findBiggestInlineWrapper(focusNode);
    if (wrapperNode
      && !wrapperNode.classList.contains('md-expand')
      && wrapperNode.lastChild
    ) {
      const backwardTokenNode = wrapperNode.lastChild;
      const tokenOffset = findOffset(containerElement, backwardTokenNode, 0);
      const tokenLength = backwardTokenNode.textContent.length;
      if (start === tokenOffset) {
        start += tokenLength;
      }
      if (end === tokenOffset) {
        end += tokenLength;
      }
    }
  }

  return {
    start,
    end,
  };
}
