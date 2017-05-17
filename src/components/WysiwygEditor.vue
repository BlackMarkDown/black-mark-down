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
    <div id="editor">
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
      const editor = this.$data.editor = new Quill('#editor');
      editor.on('text-change', (delta, oldDelta, source) => {
        console.log(delta, oldDelta, source);
        if (source === 'silent') {
          return;
        }
        this.markUp();
      });
      editor.on('selection-change', (range, oldRange, source) => {
        console.log(JSON.stringify({
          range,
          oldRange,
          source,
        }));
      });
    },
    markUp() {
      const {
        editor,
        md,
      } = this.$data;
      const text = editor.getText();
      console.log(text);
      const markdownTree = md.parse(text);
      console.log(markdownTree);

      function isLastSubstring(string, substring) {
        return string.lastIndexOf(substring) >= 0
          && string.length === string.lastIndexOf(substring) + substring.length;
      }

      const OPEN = '_open';
      const CLOSE = '_close';

      function isOpenType(type) {
        return isLastSubstring(type, OPEN);
      }

      function isCloseType(type) {
        return isLastSubstring(type, CLOSE);
      }

      function getPureType(type) {
        let suffix = '';
        if (isOpenType(type)) {
          suffix = OPEN;
        } else if (isCloseType(type)) {
          suffix = CLOSE;
        }
        return type.substring(0, type.length - suffix.length);
      }

      function findCloseToken(tokens, currentToken) {
        const {
          type: currentType,
        } = currentToken;
        const closeType = `${getPureType(currentType)}${CLOSE}`;
        const indexOfToken = tokens.indexOf(currentToken);
        const searchableTokens = tokens.slice(indexOfToken);
        return searchableTokens.find(token =>
          token.type === closeType);
      }

      function getFormatLength(tokens, startToken, endToken) {
        const indexOfStartToken = tokens.indexOf(startToken);
        const indexOfEndToken = tokens.indexOf(endToken);
        const countableTokens = tokens.slice(indexOfStartToken + 1, indexOfEndToken);
        console.log(indexOfStartToken, indexOfEndToken, countableTokens);
        return countableTokens.reduce((length, token) =>
          length + token.content.length + token.markup.length,
          0);
      }

      const formatOfTag = {
        strong: {
          bold: true,
        },
        em: {
          italic: true,
        },
      };
      const inlineMarkupFormat = {
        // color: 'rgb(0, 0, 255)',
        display: 'none',
      };

      function formatInline(tokens) {
        let textIndex = 0;
        tokens.forEach((token) => {
          const {
            content,
            type,
            tag,
            markup,
          } = token;
          if (isOpenType(type)) {
            const format = formatOfTag[tag];
            if (format) {
              const closeToken = findCloseToken(tokens, token);
              const formatLength = getFormatLength(tokens, token, closeToken);
              console.log(textIndex, formatLength);
              editor.formatText(textIndex + markup.length, formatLength, format, 'silent');
              editor.formatText(textIndex, markup.length, inlineMarkupFormat, 'silent');
              editor.formatText(textIndex + markup.length + formatLength,
                closeToken.markup.length,
                inlineMarkupFormat,
                'silent');
            }
            console.log(`no format for ${tag}`);
          }
          textIndex += content.length + markup.length;
        });
      }

      function iterate(tokens) {
        tokens.forEach((token) => {
          const {
            type,
            content,
            children,
          } = token;
          console.log(type, content);
          switch (type) {
            case 'inline': {
              formatInline(children);
            } break;
            default: break;
          }
        });
      }
      editor.removeFormat(0, editor.getLength() - 1, 'silent');
      iterate(markdownTree);
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
