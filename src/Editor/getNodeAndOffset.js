export default function getNodeAndOffset(containerElement, index) {
  const walker = document.createTreeWalker(containerElement, NodeFilter.SHOW_TEXT);
  let currentIndex = 0;
  let node = walker.nextNode();
  while (node) {
    const length = node.length;
    if (index >= currentIndex && index <= currentIndex + length) {
      return {
        node,
        offset: index - currentIndex,
      };
    }
    currentIndex += node.length;
    node = walker.nextNode();
  }
  throw new Error('No node');
}
