import Vue from 'vue';
import VueRouter from 'vue-router';
import Router from './Router';

Vue.use(VueRouter);

const app = new Vue({
  router: Router,
});

app.$mount('#app');
