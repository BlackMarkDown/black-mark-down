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
    <div id="editor-container">
      <div id="editor">{{content}}</div>
      <div id="viewer" v-html="rendered"></div>
    </div>
  </div>
</template>

<script>
import MarkdownIt from 'markdown-it';
// eslint-disable-next-line
import Ace, { EditSession, UndoManager } from 'ace';
import Explorer from '../aws/Explorer';
import IdentityManager from '../aws/IdentityManager';
import PostManager from '../aws/PostManager';
import Router from '../Router';
import getFileOwner from '../utils/getFileOwner';

const MarkdownMode = Ace.require('ace/mode/markdown').Mode;

const md = new MarkdownIt();
let editor;

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
      editor = Ace.edit('editor');
      console.log(MarkdownMode);
      editor.session.setMode(new MarkdownMode());
      editor.setOption('showGutter', false);
      editor.setOption('fontSize', 17);
      editor.setOption('hScrollBarAlwaysVisible', false);
      editor.on('change', () => {
        const content = editor.getValue();
        this.$data.content = content;
      });
    },
  },
  mounted() {
    this.initEditor();
    fetchFile(this, this.$route.params.path);
  },
  watch: {
    content(content) {
      if (editor.getValue() !== content) {
        editor.setValue(content);
      }
      const rendered = md.render(content);
      this.$data.rendered = rendered;
    },
  },
  beforeRouteEnter(to, from, next) {
    checkIsOwner(to.params.path)
    .then((isOwner) => {
      console.log(isOwner);
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
  width: 50%;
  height: 100%;
  float: left;
  border: 1px solid red;
  padding-left: 35px;
  padding-right: 35px;
}
#viewer {
  width: 50%;
  height: 100%;
  float: right;
  border: 1px solid red;
  overflow-wrap: break-word;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 5px;
}
* {
    box-sizing: border-box;
}
</style>
