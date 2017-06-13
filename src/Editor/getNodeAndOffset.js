// TODO rename this function into 'getNodeAndInnerOffset'
import treeWalk from './treeWalk';

export default function getNodeAndOffset(containerElement, targetOffset) {
  return treeWalk(containerElement, (node, offset) => {
    const length = node.length || 0;
    if (targetOffset >= offset
      && targetOffset <= offset + length) {
      switch (node.nodeName) {
        case '#text':
          return {
            node,
            offset: targetOffset - offset,
          };
        default:
          return {
            node,
            offset: 0,
          };
      }
    }
    return null;
  });
}
