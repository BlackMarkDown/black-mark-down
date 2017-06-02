import findBiggestInlineWrapper from './findBiggestInlineWrapper';

export default function getStartAndEndIndexes(containerElement) {
  const selection = window.getSelection();
  if (selection.rangeCount <= 0) {
    return {
      start: 0,
      end: 0,
    };
  }
  const range = selection.getRangeAt(0);
  const tempRange = range.cloneRange();
  tempRange.selectNodeContents(containerElement);
  tempRange.setEnd(selection.anchorNode, selection.anchorOffset);
  let start = tempRange.toString().length;
  tempRange.selectNodeContents(containerElement);
  tempRange.setEnd(selection.focusNode, selection.focusOffset);
  let end = tempRange.toString().length;

  const {
    anchorNode,
    anchorOffset,
    extentNode,
    extentOffset,
  } = selection;

  if (anchorNode.textContent.length === anchorOffset) {
    const wrapperNode = findBiggestInlineWrapper(anchorNode);
    if (wrapperNode && !wrapperNode.classList.contains('md-expand')) {
      tempRange.selectNodeContents(containerElement);
      tempRange.setEnd(wrapperNode.lastChild, 0);
      if (tempRange.toString().length === start) {
        start += wrapperNode.lastChild.textContent.length;
      }
    }
  }
  if (extentNode.textContent.length === extentOffset) {
    const wrapperNode = findBiggestInlineWrapper(extentNode);
    if (wrapperNode && !wrapperNode.classList.contains('md-expand')) {
      tempRange.selectNodeContents(containerElement);
      tempRange.setEnd(wrapperNode.lastChild, 0);
      if (tempRange.toString().length === end) {
        end += wrapperNode.lastChild.textContent.length;
      }
    }
  }

  return {
    start,
    end,
  };
}
