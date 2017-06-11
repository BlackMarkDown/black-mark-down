import findBiggestInlineWrapper from './findBiggestInlineWrapper';
import getNodeAndOffset from './getNodeAndOffset';

function addExpandClass(node) {
  if (!node) {
    return;
  }
  node.classList.add('md-expand');
}

function getNextSibilingNotText(node) {
  let nextSibling = node.nextSibling;
  while (nextSibling) {
    if (nextSibling.nodeName !== '#text') {
      return nextSibling;
    }
    nextSibling = nextSibling.nextSibling;
  }
  return null;
}

function getNextNode(node, containerElement) {
  let nextNode = node;
  while (nextNode && nextNode !== containerElement) {
    const nextSibling = getNextSibilingNotText(nextNode);

    if (nextSibling) {
      return nextSibling;
    }
    nextNode = nextNode.parentNode;
  }
  return null;
}

export default function expand(containerElement, start, end) {
  const {
    node: startTextNode,
    // offset: startOffset,
  } = getNodeAndOffset(containerElement, start);
  const {
    node: endTextNode,
    offset: endOffset,
  } = getNodeAndOffset(containerElement, end);
  const isRightDirection = start <= end;

  const startNode = findBiggestInlineWrapper(startTextNode);

  const isOnEdge = isRightDirection
    && endTextNode
    && endTextNode.textContent.length === endOffset;

  const endNode = isOnEdge
    ? findBiggestInlineWrapper(getNextNode(endTextNode, containerElement))
    : findBiggestInlineWrapper(endTextNode);

  addExpandClass(startNode);
  addExpandClass(endNode);
  if (startNode && endNode && startNode !== endNode) {
    const leftNode = isRightDirection ? startNode : endNode;
    const rightNode = isRightDirection ? endNode : startNode;

    let nextSibling = getNextSibilingNotText(leftNode);
    while (nextSibling !== rightNode && nextSibling) {
      addExpandClass(nextSibling);
      nextSibling = getNextSibilingNotText(nextSibling);
    }
  }
}
