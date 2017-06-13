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
      <p>12345asdf</p>
      <!--<p>
        <span md-inline="plain">assdfa</span>
        <span md-inline="strong_open">
          <span class="md-meta md-before">**</span>
          <strong>
            <span md-inline="plain">asdf</span>
          </strong>
          <span class="md-meta md-after">**</span>
        </span>
      </p>-->
    </div>
  </div>
</template>

<script>
import Explorer from '../aws/Explorer';
import IdentityManager from '../aws/IdentityManager';
import PostManager from '../aws/PostManager';
import Router from '../Router';
import getFileOwner from '../utils/getFileOwner';
import Editor from '../Editor';

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
      this.$data.editor = new Editor(this.$refs.editor);
    },
  },
  mounted() {
    this.initEditor();
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

p {
  white-space: pre-wrap;
  word-break: normal;
  word-wrap: break-word;
}

*:before, *:after, * {
    box-sizing: border-box;
}

.md-line {
    display: block;
    width: 100%;
}

#editor:after {
    font-size: 0;
    display: block;
    height: 0;
}

</style>
