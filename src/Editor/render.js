import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

export default function render(textContent) {
  const markdownTree = md.parseInline(textContent);
  let rendered = '';
  markdownTree[0].children.forEach((token) => {
    console.log(token);
    if (token.type === 'text') {
      rendered += `<span md-inline="plain">${token.content}</span>`;
    } else if (token.type.indexOf('open') > -1) {
      rendered += `<span md-inline="${token.type}"><span class="md-meta md-before">${token.markup}</span><${token.tag}>`;
    } else if (token.type.indexOf('close') > -1) {
      rendered += `</${token.tag}><span class="md-meta md-after">${token.markup}</span></span>`;
    }
  });
  return rendered;
}
