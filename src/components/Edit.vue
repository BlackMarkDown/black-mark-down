<template>
  <div>
    <h2>Editing {{filename}}</h2>
    <div id="editor">abc</div>
    <div v-html="rendered"></div>
    <button v-on:click="save()">save</button>
    <button v-on:click="post()">post</button>
  </div>
</template>

<script>
import MarkdownIt from 'markdown-it';
// eslint-disable-next-line
import Ace, { EditSession, UndoManager } from 'ace';
import Explorer from '../aws/Explorer';
import PostManager from '../aws/PostManager';
import Router from '../Router';

const md = new MarkdownIt();
console.log(Ace, EditSession, UndoManager, md);

export default {
  name: 'edit',
  data() {
    return {
      filename: '', // TODO
      content: '',
      rendered: '',
    };
  },
  methods: {
    save() {
      const filePath = this.$route.params.path;
      PostManager.saveWhileEditing(filePath, this.$data.content)
      .then(() => alert('Successfully saved'));
    },
    post() {
      const filePath = this.$route.params.path;
      console.log(this.$data.content);
      PostManager.post(filePath, this.$data.content)
      .then(path => Router.push(`/view/${path}`));
    },
  },
  mounted() {
    const editor = Ace.edit('editor');
    editor.on('change', () => {
      const content = editor.getValue();
      this.$data.content = content;
      const rendered = md.render(content);
      this.$data.rendered = rendered;
    });
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      const filePath = to.params.path;
      Explorer.getFile(filePath, Explorer.ObjectType.DRAFT_FILE)
      .then((content) => {
        // eslint-disable-next-line
        vm.content = content;
        const rendered = md.render(content);
        // eslint-disable-next-line
        vm.rendered = rendered;
      });
    });
  },
};
</script>

<style>
#editor {
  position: relative;
  width: 500px;
  height: 100px;
}
</style>
