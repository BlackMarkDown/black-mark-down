// TODO rename this function into 'getNodeAndInnerOffset'

export default function getNodeAndOffset(containerElement, index) {
  /* eslint no-bitwise: ["error", { "allow": ["|"] }] */
  const walker = document.createTreeWalker(containerElement,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  let currentIndex = 0;
  let node = walker.nextNode();
  while (node) {
    const {
      nodeName,
      length,
    } = node;
    if (nodeName === '#text'
      || nodeName === 'BR'
      || nodeName === 'P') {
      if (nodeName === '#text'
        && index >= currentIndex
        && index <= currentIndex + length) {
        return {
          node,
          offset: index - currentIndex,
        };
      }
      if (nodeName === '#text') {
        currentIndex += length;
      } else if (nodeName === 'BR') {
        currentIndex += 1;
      } else if (nodeName === 'P') {
        currentIndex += 2;
      }
    }
    node = walker.nextNode();
  }
  throw new Error('No node');
}
