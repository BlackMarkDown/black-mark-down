import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
  breaks: true,
});

function parseToken(token) {
  if (token.type === 'paragraph_open') {
    return '<p>';
  } else if (token.type === 'paragraph_close') {
    return '</p>';
  } else if (token.type === 'softbreak') {
    return '<br>';
  } else if (token.type === 'text') {
    return `<span md-inline="plain">${token.content}</span>`;
  } else if (token.type.indexOf('open') > -1) {
    return `<span md-inline="${token.type}"><span class="md-meta md-before">${token.markup}</span><${token.tag}>`;
  } else if (token.type.indexOf('close') > -1) {
    return `</${token.tag}><span class="md-meta md-after">${token.markup}</span></span>`;
  }
  return '';
}

function renderMarkdownTree(markdownTree) {
  if (!markdownTree) {
    return '';
  }
  return markdownTree.reduce((rendered, token) =>
    rendered + parseToken(token) + renderMarkdownTree(token.children)
  , '');
}

export default function rerenderHTML(markdownContent) {
  const markdownTree = md.parse(markdownContent);
  return renderMarkdownTree(markdownTree);
}
