import VueRouter from 'vue-router';
import LogIn from './components/LogIn';
import Docs from './components/Docs';
import View from './components/View';

const routes = [
  { path: '/', component: LogIn },
  { path: '/:username/(.*/)*', component: Docs },
  { path: '/:username/*', component: View },
];

const Router = new VueRouter({
  mode: 'history',
  routes,
});

export default Router;
