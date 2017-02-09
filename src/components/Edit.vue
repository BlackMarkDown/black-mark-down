<template>
  <div>
    <h2>Editing {{filename}}</h2>
    <div id="editor">abc</div>
    <div v-html="rendered"></div>
  </div>
</template>

<script>
import MarkdownIt from 'markdown-it';
// eslint-disable-next-line
import Ace, { EditSession, UndoManager } from 'ace';
import Explorer from '../aws/Explorer';

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
  mounted() {
    console.log('mounted');
    const editor = Ace.edit('editor');
    editor.on('change', () => {
      console.log('change', this);
      const content = editor.getValue();
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
  height: 400px;
}
</style>
