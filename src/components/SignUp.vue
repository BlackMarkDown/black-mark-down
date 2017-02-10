<template>
  <div>
    <h2>Fill your information</h2>
      Username: <input v-model="username" >
      Email: <input v-model="email" >
      Password: <input type="password" v-model="password" >
    <button v-on:click="signUp()">Sign Up</button>
  </div>
</template>

<script>
import IdentityManager from '../aws/IdentityManager';
import Router from '../Router';

function beforeRoute(next) {
  IdentityManager.checkIsLoggedIn()
  .then(isLoggedIn => next(!isLoggedIn));
}

export default {
  name: 'sign-up',
  data() {
    return ({
      username: '',
      email: '',
      password: '',
    });
  },
  methods: {
    signUp() {
      IdentityManager.signUp(this.$data.username, this.email, this.password)
      .then(() => {
        alert('Successfully signed up!');
        Router.push('/');
      })
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
