import getPosition from './getPosition';

export default function findBoundElement(line, element) {
  for (let i = 0; i < element.children.length; i += 1) {
    let child = element.children[i];
    if (child.nodeName === 'PRE') {
      child = child.children[0];
    }
    if (child.dataset.sourcepos) {
      const {
        start,
        end,
      } = getPosition(child);
      if (start <= line && line <= end) {
        return findBoundElement(line, child) || child;
      }
    }
  }
  return null;
}
