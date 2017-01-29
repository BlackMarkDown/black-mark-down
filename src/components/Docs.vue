<template>
  <div>
    <h2>Docs of {{username}}</h2>
    <ul>
      <template v-for="item in items">
        <li>
          <router-link :to="item.relativePath" append>{{ item.type }} - {{ item.name }}</router-link>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import Explorer from '../aws/Explorer';

const fetchItems = (vm, to) => {
  console.log(to.path);
  Explorer.queryPath(to.path)
  .then((data) => {
    console.log(data);
    console.log(vm);
    /* eslint no-param-reassign: ["off", { "props": true }] */
    vm.items = [];
    data.folders.forEach(folder =>
      vm.items.push({
        type: 'folder',
        name: folder.name,
        relativePath: `${folder.name}/`,
      })
    );
    data.files.forEach(file =>
      vm.items.push({
        type: 'file',
        name: file.name,
        relativePath: file.name,
      })
    );
  });
};

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
    console.log(to);
    next(vm => fetchItems(vm, to));
  },
  beforeRouteUpdate(to, from, next) {
    console.log(to);
    fetchItems(this, to);
    next();
  },
};
</script>

<style>
</style>
