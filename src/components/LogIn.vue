<template>
  <div>
    <h2>Log In!</h2>
    <router-link :to="'/signup'">Join Us</router-link>
      Username: <input v-model="username" placeholder="" >
      Password: <input type="password" v-model="password" placeholder="">
    <button v-on:click="logIn()">Log In</button>
  </div>
</template>

<script>
import IdentityManager from '../aws/IdentityManager';
import Router from '../Router';

function beforeRoute(next) {
  IdentityManager.checkIsLoggedIn()
  .then((isLoggedIn) => {
    if (isLoggedIn) {
      return IdentityManager.getUsername()
        .then(username => next(`/docs/${username}`));
    }
    return next(true);
  });
}

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
      console.log(this.username, this.$data.username);
      IdentityManager.logIn(this.username, this.password)
      .then(IdentityManager.getUsername)
      .then(username => Router.push(`/docs/${username}`))
      .catch(err => alert(err));
    },
  },
  beforeRouteEnter(to, from, next) {
    beforeRoute(next);
  },
  beforeRouteUpdate(to, from, next) {
    beforeRoute(next);
  },
};
</script>

<style>
</style>
