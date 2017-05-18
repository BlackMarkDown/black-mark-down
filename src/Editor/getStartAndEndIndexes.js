import findBiggestInlineWrapper from './findBiggestInlineWrapper';

export default function getStartAndEndIndexes(containerElement) {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const tempRange = range.cloneRange();
  tempRange.selectNodeContents(containerElement);
  tempRange.setEnd(range.startContainer, range.startOffset);
  let start = tempRange.toString().length;
  let end = start + range.toString().length;

  const {
    anchorNode,
    anchorOffset,
  } = selection;

  if (anchorNode.textContent.length === anchorOffset) {
    const wrapperNode = findBiggestInlineWrapper(anchorNode);
    if (wrapperNode && !wrapperNode.classList.contains('md-expand')) {
      tempRange.setEnd(wrapperNode.lastChild, 0);
      if (tempRange.toString().length === start) {
        start += wrapperNode.lastChild.textContent.length;
        if (end < start) {
          end += wrapperNode.lastChild.textContent.length;
        }
      }
    }
  }

  return {
    start,
    end,
  };
}
