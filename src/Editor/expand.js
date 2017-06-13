import treeWalk from './treeWalk';

function addExpandClass(node) {
  node.classList.add('md-expand');
}

export default function expand(containerElement, start, end) {
  const leftOffset = Math.min(start, end);
  const rightOffset = Math.max(start, end);

  return treeWalk(containerElement, (node, offset) => {
    const length = node.textContent.length;
    const isHangingOnLeftOffset = offset <= leftOffset && leftOffset <= offset + length;
    const isInside = leftOffset <= offset && offset <= rightOffset;
    const isHangingOnRightOffset = offset <= rightOffset && rightOffset <= offset + length;
    const isInlineToken = node.hasAttribute && node.hasAttribute('md-inline');
    if (
      isInlineToken && (
        isHangingOnLeftOffset
        || isInside
        || isHangingOnRightOffset
      )
    ) {
      addExpandClass(node);
    }
  });
}
