import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

export default function render(textContent) {
  const markdownTree = md.parseInline(textContent);
  let rendered = '';
  markdownTree[0].children.forEach((token) => {
    switch (token.type) {
      case 'text': {
        rendered += `<span md-inline="plain">${token.content}</span>`;
      } break;
      case 'strong_open': {
        rendered += '<span md-inline="strong"><span class="md-meta md-before">**</span><strong>';
      } break;
      case 'strong_close': {
        rendered += '</strong><span class="md-meta md-after">**</span></span>';
      } break;
      default: break;
    }
  });
  return rendered;
}
