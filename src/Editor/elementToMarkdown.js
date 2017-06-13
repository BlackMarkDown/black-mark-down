import treeWalk from './treeWalk';

export default function elementToMarkdown(element) {
  let sum = '';
  treeWalk(element, (node, offset, markdownContent) => {
    let content;
    if (node.nodeName === 'P' && node.textContent.length === 0) {
      content = `${markdownContent}\u200B`;
    } else {
      content = markdownContent || '';
    }
    sum += content;
  });
  return sum;
}
