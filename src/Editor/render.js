import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
  html: true,
  breaks: true,
});

// const headTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
// const blockTags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
function parseToken(token) {
  if (token.type === 'paragraph_open') {
    return '<p>';
  } else if (token.type === 'paragraph_close') {
    return '</p>';
  } else if (token.type === 'softbreak') {
    return '\n';
  } else if (token.type === 'text') {
    return `<span md-inline="plain">${token.content}</span>`;
  } else if (token.type.indexOf('open') > -1) {
    return `<span md-inline="${token.type}"><span class="md-meta md-before">${token.markup}</span><${token.tag}>`;
  } else if (token.type.indexOf('close') > -1) {
    const closeMarkup =
/*      headTags.includes(token.tag)
      ? ''
      : token.markup;*/
      token.markup;
    return `</${token.tag}><span class="md-meta md-after">${closeMarkup}</span></span>`;
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
  const markdownTree = md.parse(markdownContent);
  return renderMarkdownTree(markdownTree).replace('\u200B', '<br>');
}
