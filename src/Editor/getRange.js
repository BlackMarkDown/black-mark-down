export default function getRange(containerElement, start, end) {
  const range = document.createRange();
  range.setStart(containerElement, 0);
  range.collapse(true);

  const walker = document.createTreeWalker(containerElement, NodeFilter.SHOW_TEXT);

  let index = 0;
  let foundStart = false;
  while (true) {
    const node = walker.nextNode();
    if (!node) {
      break;
    }
    const length = node.length;
    if (!foundStart && start >= index && start <= index + length) {
      range.setStart(node, start - index);
      foundStart = true;
    }
    if (end >= index && end <= index + length) {
      range.setEnd(node, end - index);
      break;
    }

    index += node.length;
  }
  return range;
}
