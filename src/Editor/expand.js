import findBiggestInlineWrapper from './findBiggestInlineWrapper';

function addExpandClass(startNode) {
  if (!startNode) {
    return;
  }
  const wrapperNode = findBiggestInlineWrapper(startNode);
  if (wrapperNode) {
    wrapperNode.classList.add('md-expand');
  }
}

export default function expand(range) {
  const {
    // endContainer,
    // endOffset,
    startContainer,
    startOffset,
  } = range;
  addExpandClass(startContainer);
  if (startContainer.textContent.length === startOffset) {
    addExpandClass(startContainer.nextSibling || startContainer.parentNode.nextSibling);
  }
}
