import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
  html: true,
  breaks: true,
});

function parseToken(token) {
  if (token.type === 'paragraph_open') {
    return '<p><span class="md-line">';
  } else if (token.type === 'paragraph_close') {
    return '</span></p>';
  } else if (token.type === 'softbreak') {
    return '</span><br><span class="md-line">';
  } else if (token.type === 'text') {
    return `<span md-inline="plain">${token.content}</span>`;
  } else if (token.type.indexOf('open') > -1) {
    return `<span md-inline="${token.type}"><span class="md-meta md-before">${token.markup}</span><${token.tag}>`;
  } else if (token.type.indexOf('close') > -1) {
    return `</${token.tag}><span class="md-meta md-after">${token.markup}</span></span>`;
  } else if (token.type === 'html_block') {
    return token.content;
  }
  return '';
}

function renderMarkdownTree(markdownTree) {
  if (!markdownTree) {
    return '';
  }
  return markdownTree.reduce((rendered, token) =>
    `${rendered}${parseToken(token)}${renderMarkdownTree(token.children)}`
  , '');
}

export default function render(markdownContent) {
  const markdownTree = md.parseInline(markdownContent);
  return renderMarkdownTree(markdownTree);
}
