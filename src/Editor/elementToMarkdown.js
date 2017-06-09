export default function elementToMarkdown(element) {
  /* eslint no-bitwise: ["error", { "allow": ["|"] }] */
  const walker = document.createTreeWalker(element,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  let isFirstParagraph = true;
  let isFirstLine = true;
  let markdownContent = '';
  while (node) {
    const {
      nodeName,
      textContent,
    } = node;

    switch (nodeName) {
      case 'P':
        isFirstLine = true;
        if (isFirstParagraph) {
          isFirstParagraph = false;
          break;
        }
        markdownContent += '\n\n';
        break;
      case 'SPAN':
        if (node.classList.contains('md-line')) {
          if (isFirstLine) {
            isFirstLine = false;
            break;
          }
          markdownContent += '\n';
        }
        break;
      case '#text':
        markdownContent += textContent;
        break;
      default:
        break;
    }
    node = walker.nextNode();
  }
  return markdownContent;
}
