<template>
  <button v-on:click="onClick">Log In</button>
</template>

<script>
import Router from '../Router';

export default {
  name: 'log-in-button',
  methods: {
    onClick() {
      Router.push('/');
    },
  },
};
</script>

<style>
</style>
