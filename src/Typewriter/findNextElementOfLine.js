import getPosition from './getPosition';

export default function findNextElementOfLine(line, rootElement) {
  let nextElement;
  let minStart = Number.POSITIVE_INFINITY;
  const treeWalker = document.createTreeWalker(rootElement, NodeFilter.SHOW_ELEMENT);
  while (treeWalker.nextNode()) {
    const element = treeWalker.currentNode;
    if (element.dataset.sourcepos) {
      const {
        start,
      } = getPosition(element);
      if (line < start && start < minStart) {
        minStart = start;
        nextElement = element;
      }
    }
  }
  return nextElement;
}
