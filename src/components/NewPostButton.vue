<template>
  <button v-on:click="onClick">New Post</button>
</template>

<script>
import PostManager from '../aws/PostManager';
import Router from '../Router';

export default {
  name: 'new-post-button',
  methods: {
    onClick() {
      const directory = this.$route.params.path;
      PostManager.init(directory)
      .then((path) => {
        Router.push(`/edit/${path}/`);
      });
    },
  },
};
</script>

<style>
</style>
