import treeWalk from './treeWalk';

export default function elementToMarkdown(element) {
  let sum = '';
  treeWalk(element, (node, offset, markdownContent) => {
    sum += markdownContent || '';
  });
  return sum;
}
