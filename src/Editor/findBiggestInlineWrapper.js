export default function findBiggestInlineWrapper(startNode) {
  let ret;
  let node = startNode;
  while (node) {
    if (node.hasAttribute && node.hasAttribute('md-inline')) {
      ret = node;
    }
    node = node.parentNode;
  }
  return ret;
}
