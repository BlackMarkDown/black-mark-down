<template>
  <div id="page">
    <div id="header">
    <template v-if="isEditingFilename">
      <input v-model="filename">
      <button v-on:click="save()">confirm</button>
    </template>
    <template v-else>
      <div id="title">{{filename}}</div>
      <button v-on:click="isEditingFilename = true">change filename</button>
    </template>
    <button v-on:click="save()">save</button>
    <button v-on:click="post()">post</button>
    </div>
    <div id="editor" ref="editor" contenteditable="true">
      <span> asdf </span>
    </div>
  </div>
</template>

<script>
import Quill from 'quill';
import MarkdownIt from 'markdown-it';
import Explorer from '../aws/Explorer';
import IdentityManager from '../aws/IdentityManager';
import PostManager from '../aws/PostManager';
import Router from '../Router';
import getFileOwner from '../utils/getFileOwner';
import DisplayStyle from './Editor/formats/DisplayStyle';

Quill.register({
  'attribute/style/display': DisplayStyle,
  'formats/display': DisplayStyle,
}, true);

function fetchFile(vm, path) {
  Explorer.getFile(path, Explorer.ObjectType.DRAFT_FILE)
  .then((content) => {
    // eslint-disable-next-line
    vm.content = content;
    const lastIndexOfSlash = path.lastIndexOf('/');
    const filename = path.substr(lastIndexOfSlash + 1);
    // eslint-disable-next-line
    vm.filename = filename;
  });
}

const checkIsOwner = filePath => new Promise(resolve =>
  IdentityManager.checkIsLoggedIn()
  .then((isLoggedIn) => {
    if (!isLoggedIn) {
      return resolve(false);
    }
    const fileOwner = getFileOwner(filePath);
    return IdentityManager.getUsername()
      .then(username => resolve(fileOwner === username));
  }));

function findBiggestInlineWrapper(startNode) {
  let ret;
  let node = startNode;
  while (node) {
    if (node.hasAttribute && node.hasAttribute('md-inline')) {
      ret = node;
    }
    node = node.parentNode;
  }
  return ret;
}

function setExpand(startNode) {
  if (!startNode) {
    return;
  }
  const wrapperNode = findBiggestInlineWrapper(startNode);
  console.log('wrapperNode', wrapperNode);
  if (wrapperNode) {
    wrapperNode.classList.add('md-expand');
  }
}

export default {
  name: 'edit',
  data() {
    return {
      filename: '',
      content: '',
      rendered: '',
      isEditingFilename: false,
      md: undefined,
      editor: undefined,
    };
  },
  methods: {
    save() {
      const newFilePath = this.generateNewFilePath();
      PostManager.saveWhileEditing(newFilePath, this.$data.content)
      .then((path) => {
        Router.replace(`/edit/${path}`);
        alert('Successfully saved');
        this.$data.isEditingFilename = false;
      });
    },
    post() {
      const newFilePath = this.generateNewFilePath();
      PostManager.post(newFilePath, this.$data.content)
      .then(path => Router.push(`/view/${path}`));
    },
    generateNewFilePath() {
      const filePath = this.$route.params.path;
      const lastIndexOfSlash = filePath.lastIndexOf('/');
      const filenameRemovedFilePath = filePath.substring(0, lastIndexOfSlash);
      const newFilePath = `${filenameRemovedFilePath}/${this.$data.filename}`;
      return newFilePath;
    },
    initEditor() {
      const editor = this.$refs.editor;
      const md = this.$data.md = new MarkdownIt();

      let saveSelection;
      let restoreSelection;

      function getSelectionFromSaved(containerEl, savedSel) {
        let charIndex = 0;
        const nodeStack = [containerEl];
        let node;

        while (true) {
          node = nodeStack.pop();
          if (node) {
            if (node.nodeType === 3) {
              const nextCharIndex = charIndex + node.length;
              if (savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
                return {
                  anchorNode: node,
                  anchorOffset: savedSel.start - charIndex,
                };
              }
              charIndex = nextCharIndex;
            } else {
              let i = node.childNodes.length;
              while (i >= 0) {
                nodeStack.push(node.childNodes[i]);
                i -= 1;
              }
            }
          }
        }
      }

      if (window.getSelection && document.createRange) {
        saveSelection = function (containerEl) {
          const range = window.getSelection().getRangeAt(0);
          const preSelectionRange = range.cloneRange();
          preSelectionRange.selectNodeContents(containerEl);
          preSelectionRange.setEnd(range.startContainer, range.startOffset);
          const start = preSelectionRange.toString().length;

          return {
            start,
            end: start + range.toString().length,
          };
        };
        restoreSelection = function (containerEl, savedSel) {
          let charIndex = 0;
          const range = document.createRange();
          range.setStart(containerEl, 0);
          range.collapse(true);
          const nodeStack = [containerEl];
          let node;
          let foundStart = false;
          let stop = false;

          while (!stop) {
            node = nodeStack.pop();
            if (node) {
              if (node.nodeType === 3) {
                const nextCharIndex = charIndex + node.length;
                if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
                  range.setStart(node, savedSel.start - charIndex);
                  foundStart = true;
                }
                if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
                  range.setEnd(node, savedSel.end - charIndex);
                  stop = true;
                }
                charIndex = nextCharIndex;
              } else {
                let i = node.childNodes.length;
                while (i >= 0) {
                  nodeStack.push(node.childNodes[i]);
                  i -= 1;
                }
              }
            }
          }

          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        };
      } else if (document.selection) {
        saveSelection = function (containerEl) {
          const selectedTextRange = document.selection.createRange();
          const preSelectionTextRange = document.body.createTextRange();
          preSelectionTextRange.moveToElementText(containerEl);
          preSelectionTextRange.setEndPoint('EndToStart', selectedTextRange);
          const start = preSelectionTextRange.text.length;

          return {
            start,
            end: start + selectedTextRange.text.length,
          };
        };

        restoreSelection = function (containerEl, savedSel) {
          const textRange = document.body.createTextRange();
          textRange.moveToElementText(containerEl);
          textRange.collapse(true);
          textRange.moveEnd('character', savedSel.end);
          textRange.moveStart('character', savedSel.start);
          textRange.select();
        };
      }

      editor.addEventListener('keyup', () => {
        const text = editor.innerHTML.replace(/<[^>]*>/g, '');
        console.log(text);
        const markdownTree = md.parseInline(text);
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
        const savedSelection = saveSelection(editor);

        const selection = window.getSelection();
        console.log(savedSelection, selection);
        console.log(selection.anchorNode.textContent.length, selection.anchorOffset);
        if (selection.anchorNode.textContent.length === selection.anchorOffset) {
          const wrapperNode = findBiggestInlineWrapper(selection.anchorNode);
          if (wrapperNode && !wrapperNode.classList.contains('md-expand')) {
            const range = document.createRange();
            range.selectNodeContents(editor);
            range.setEnd(wrapperNode.lastChild, 0);
            if (range.toString().length === savedSelection.start) {
              savedSelection.start += wrapperNode.lastChild.textContent.length;
              if (savedSelection.end < savedSelection.start) {
                savedSelection.end += wrapperNode.lastChild.textContent.length;
              }
            }
          }
        }
        editor.innerHTML = `${rendered}`;
        console.log(savedSelection);
        const {
          anchorNode,
          anchorOffset,
        } = getSelectionFromSaved(editor, savedSelection);
        console.log(anchorNode, anchorOffset);
        setExpand(anchorNode);
        if (anchorNode.textContent.length === anchorOffset) {
          setExpand(anchorNode.nextSibling || anchorNode.parentNode.nextSibling);
        }

        restoreSelection(editor, savedSelection);
      });
    },
  },
  mounted() {
    this.initEditor();
    this.$data.md = new MarkdownIt();
    fetchFile(this, this.$route.params.path);
  },
  beforeRouteEnter(to, from, next) {
    checkIsOwner(to.params.path)
    .then((isOwner) => {
      if (!isOwner) {
        return next('/');
      }
      return next();
    });
  },
  beforeRouteUpdate(to, from, next) {
    checkIsOwner(to.params.path)
    .then((isOwner) => {
      if (!isOwner) {
        return next('/');
      }
      fetchFile(this, to.params.path);
      return next();
    });
  },
};
</script>

<style scoped>
#page {
  width: 100%;
  height: 100%
}
#header {
  width: 100%;
  height: 30px;
}
#title {
  display: inline-block;
}
button {
  display: inline-block;
}
#editor-container {
  width: 100%;
  height: calc(100% - 30px);
}
#editor {
  width: 100%;
  height: 100%;
  float: left;
  border: 1px solid red;
  padding-left: 35px;
  padding-right: 35px;
}

* {
  box-sizing: border-box;
}

</style>

<style>

.md-empty .md-meta,
.md-expand .md-meta,
.md-expand .md-content,
.md-expand.md-meta,
.md-expand.md-content {
    display: inline;
}

#write.md-expand .md-meta,
#write.md-expand .md-content {
    display: inline !important;
}

img {
    cursor: default;
    border-left: 2px transparent solid;
    border-right: 4px transparent solid;
}

.md-expand>img {
    display: none;
}

.md-content {
    display: none;
    color: #5b808d;
}

.md-meta {
    display: none;
    color: #BBBBBB;
}

.md-before,
.md-after {
    padding: 0px;
}

</style>
