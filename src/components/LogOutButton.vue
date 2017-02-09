<template>
  <button v-on:click="onClick">Log Out</button>
</template>

<script>
import IdentityManager from '../aws/IdentityManager';
import Router from '../Router';

export default {
  name: 'log-out-button',
  methods: {
    onClick() {
      IdentityManager.logOut();
      Router.push('/');
    },
  },
};
</script>

<style>
</style>
