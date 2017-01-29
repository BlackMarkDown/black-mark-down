<template>
  <div>
    <h2>Docs of {{username}}</h2>
    <ul>
      <template v-for="item in items">
        <li>{{ item.type }} - {{ item.name }}</li>
      </template>
    </ul>
  </div>
</template>

<script>
import Explorer from '../aws/Explorer';

export default {
  name: 'docs',
  data() {
    const {
      username,
    } = this.$route.params;
    return {
      username,
      items: [],
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      Explorer.queryPath(to.path)
      .then((data) => {
        console.log(data);
        console.log(vm);
        data.folders.forEach(folder =>
          vm.items.push({
            type: 'folder',
            name: folder.name,
          })
        );
        data.files.forEach(file =>
          vm.items.push({
            type: 'file',
            name: file.name,
          })
        );
      });
    });
  },
};
</script>

<style>
</style>
