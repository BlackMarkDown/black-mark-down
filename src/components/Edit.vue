<template>
  <div>
    <h2>Editing {{filename}}</h2>
    <div>{{content}}</div>
  </div>
</template>

<script>
import Explorer from '../aws/Explorer';

export default {
  name: 'edit',
  data() {
    return {
      filename: '', // TODO
      content: '',
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      const filePath = to.params.path;
      Explorer.getFile(filePath, Explorer.ObjectType.DRAFT_FILE)
      .then((content) => {
        /* eslint no-param-reassign: ["off", { "props": true }] */
        vm.content = content;
      });
    });
  },
};
</script>

<style>
</style>
