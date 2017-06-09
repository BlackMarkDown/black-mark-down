import getNodeAndOffset from './getNodeAndOffset';

export default function restoreSelection(containerElement, start, end) {
  const selection = window.getSelection();
  selection.removeAllRanges();

  const {
    node: startNode,
    offset: startOffset,
  } = getNodeAndOffset(containerElement, start);
  const {
    node: endNode,
    offset: endOffset,
  } = getNodeAndOffset(containerElement, end);

  const range = document.createRange();
  range.setStart(startNode, startOffset);
  selection.addRange(range);
  selection.extend(endNode, endOffset);
}
