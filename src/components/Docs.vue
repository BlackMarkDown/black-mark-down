<template>
  <div>
    <h2>path : {{path}}</h2>
    <log-in-button v-if="!isLoggedIn" />
    <log-out-button v-if="isLoggedIn" />
    <new-post-button v-if="isOwner" />
    <ul>
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
import IdentityManager from '../aws/IdentityManager';
import NewPostButton from './NewPostButton';
import LogOutButton from './LogOutButton';
import LogInButton from './LogInButton';
import getFileOwner from '../utils/getFileOwner';

const fetchItems = (vm, path) => {
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
      isLoggedIn: false,
      isOwner: false,
    };
  },
  mounted() {
    fetchItems(this, this.$route.params.path);

    IdentityManager.checkIsLoggedIn()
    .then((isLoggedIn) => {
      this.$data.isLoggedIn = isLoggedIn;
    });

    const filePath = this.$route.params.path;
    const fileOwner = getFileOwner(filePath);

    IdentityManager.getUsername()
    .then((username) => {
      this.$data.isOwner = (username === fileOwner);
    });
  },
  beforeRouteEnter(to, from, next) {
    next();
  },
  beforeRouteUpdate(to, from, next) {
    fetchItems(this, to.params.path);
    next();
  },
  components: {
    NewPostButton,
    LogOutButton,
    LogInButton,
  },
};
</script>

<style>
</style>
