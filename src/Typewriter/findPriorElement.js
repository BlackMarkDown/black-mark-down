import getPosition from './getPosition';

export default function findPriorElement(line, rootElement) {
  let priorElement;
  let maxEnd = 0;
  const treeWalker = document.createTreeWalker(rootElement, NodeFilter.SHOW_ELEMENT);
  while (treeWalker.nextNode()) {
    const element = treeWalker.currentNode;
    if (element.dataset.sourcepos) {
      const {
        start,
        end,
      } = getPosition(element);
      if (line < start) {
        break;
      }
      if (maxEnd <= end && end <= line) {
        maxEnd = end;
        priorElement = element;
      }
    }
  }
  return priorElement;
}
