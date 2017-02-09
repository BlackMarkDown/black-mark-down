<template>
  <div>
    <h2>filename: {{  }}</h2>
    <div v-html="rendered"></div>
  </div>
</template>

<script>
import MarkdownIt from 'markdown-it';
import Explorer from '../aws/Explorer';

const md = new MarkdownIt();

export default {
  name: 'view',
  data() {
    return ({
      rendered: '',
    });
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      const filePath = to.params.path;
      Explorer.getFile(filePath, Explorer.ObjectType.PUBLIC_FILE)
      .then((content) => {
        /* eslint no-param-reassign: ["off", { "props": true }] */
        const rendered = md.render(content);
        vm.rendered = rendered;
      });
    });
  },
};
</script>

<style>
</style>
