<template>
  <div>
    <h2>Log In</h2>
    Username: <input v-model="username" placeholder="" >
    Password: <input type="password" v-model="password" placeholder="">
    <button v-on:click="logIn()">Log In</button>
  </div>
</template>

<script>
import IdentityManager from '../aws/IdentityManager';
import Router from '../Router';

export default {
  name: 'log-in',
  data() {
    return ({
      username: '',
      password: '',
    });
  },
  methods: {
    logIn() {
      IdentityManager.logIn(this.username, this.password)
      .then(() => {
        const username = IdentityManager.getUsername();
        Router.push(`/docs/${username}/`);
      })
      .catch(err => alert(err));
    },
  },
};
</script>

<style>
</style>
