<template>
  <div>
    <h2>path : {{path}}</h2>
    <ul>
      <log-out-button />
      <new-post-button />
      <template v-for="item in items">
        <li>
          <router-link :to="item.path">{{ item.type }} - {{ item.name }}</router-link>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import Explorer from '../aws/Explorer';
import NewPostButton from './NewPostButton';
import LogOutButton from './LogOutButton';

const fetchItems = (vm, path) => {
  console.log('fetchItems');
  Explorer.queryPath(path)
  .then((data) => {
    /* eslint no-param-reassign: ["off", { "props": true }] */
    vm.items = [];
    data.folders.forEach(folder =>
      vm.items.push({
        type: 'folder',
        name: folder.name,
        path: `/docs/${path}/${folder.name}`,
      })
    );
    data.files.forEach(file =>
      vm.items.push({
        type: 'file',
        name: file.name,
        path: `/view/${path}/${file.name}`,
      })
    );
  });
};

export default {
  name: 'docs',
  data() {
    const {
      path,
    } = this.$route.params;
    return {
      path,
      items: [],
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => fetchItems(vm, to.params.path));
  },
  beforeRouteUpdate(to, from, next) {
    fetchItems(this, to.params.path);
    next();
  },
  components: {
    NewPostButton,
    LogOutButton,
  },
};
</script>

<style>
</style>
