<template>
  <div>
    <h2>filename: {{  }}</h2>
    <div>{{ content }}</div>
  </div>
</template>

<script>
import Explorer from '../aws/Explorer';

console.log('view');
export default {
  name: 'view',
  data() {
    return ({
      content: '',
    });
  },
  beforeRouteEnter(to, from, next) {
    console.log('enter view');
    next((vm) => {
      Explorer.getFile(to.path, Explorer.ObjectType.PUBLIC_FILE)
      .then((content) => {
        console.log(content);
        /* eslint no-param-reassign: ["off", { "props": true }] */
        vm.content = content;
      });
    });
  },
};
</script>

<style>
</style>
