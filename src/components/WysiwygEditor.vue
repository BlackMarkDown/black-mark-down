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
    <div id="editor" ref="editor">
    </div>
  </div>
</template>

<script>
import Explorer from '../aws/Explorer';
import IdentityManager from '../aws/IdentityManager';
import PostManager from '../aws/PostManager';
import Router from '../Router';
import getFileOwner from '../utils/getFileOwner';
import Typewriter from '../Typewriter';

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
      rendered: '',
      isEditingFilename: false,
      md: undefined,
      editor: undefined,
    };
  },
  methods: {
    save() {
      const newFilePath = this.generateNewFilePath();
      const content = this.$data.editor.getText();
      PostManager.saveWhileEditing(newFilePath, content)
      .then((path) => {
        Router.replace(`/edit/${path}`);
        alert('Successfully saved');
        this.$data.isEditingFilename = false;
      });
    },
    post() {
      const newFilePath = this.generateNewFilePath();
      const content = this.$data.editor.getText();
      PostManager.post(newFilePath, content)
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
      this.$data.editor = new Typewriter(this.$refs.editor);
    },
  },
  mounted() {
    this.initEditor();
    fetchFile(this, this.$route.params.path)
    .then(text => this.$data.editor.setText(text));
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

* {
  box-sizing: border-box;
}

</style>

<style>
p {
  word-break: normal;
  word-wrap: break-word;
}

body {
  overflow: hidden;
}

#editor {
  width: 100%;
  height: 100%;
  float: left;
  border: 1px solid red;
  padding-left: 35px;
  padding-right: 35px;
}
#top-view {
  width: 100%;
  height: 200px;
  /*border: 1px solid blue;*/
  overflow: hidden;
}
#top-view-content {
  width: 100%;
  position: relative;
  padding-top: 200px;
}
#bottom-view {
  width: 100%;
  height: 200px;
  /*border: 1px solid blue;*/
  overflow: hidden;
}
#bottom-view-content {
  width: 100%;
  position: relative;
  padding-bottom: 200px;
}
#code-editor {
  width: auto;
  height: 100px;
}
.CodeMirror {
  height: 21.6px;
  min-height: 0;
  padding: 0px;
}
.CodeMirror-scroll {
  min-height: 0;
}
</style>
