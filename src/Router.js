import VueRouter from 'vue-router';
import LogIn from './components/LogIn';
import Docs from './components/Docs';

const routes = [
  { path: '/', component: LogIn },
  { path: '/:username', component: Docs },
];

const Router = new VueRouter({
  mode: 'history',
  routes,
});

export default Router;
