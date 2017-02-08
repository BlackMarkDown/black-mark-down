import VueRouter from 'vue-router';
import LogIn from './components/LogIn';
import Docs from './components/Docs';
import View from './components/View';
import Edit from './components/Edit';

// Promise me, URL must look like /:Action/Directory
const routes = [
  { path: '/', component: LogIn },
  { path: '/docs/:path*', component: Docs },
  { path: '/view/:path*', component: View },
  { path: '/edit/:path*', component: Edit },
];

const Router = new VueRouter({
  mode: 'history',
  routes,
});

export default Router;
