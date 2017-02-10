import VueRouter from 'vue-router';
import Docs from './components/Docs';
import Edit from './components/Edit';
import LogIn from './components/LogIn';
import SignUp from './components/SignUp';
import View from './components/View';

// Promise me, URL must look like /:Action/Directory
const routes = [
  { path: '/', component: LogIn },
  { path: '/signup', component: SignUp },
  { path: '/docs/:path*', component: Docs },
  { path: '/view/:path*', component: View },
  { path: '/edit/:path*', component: Edit },
];

const Router = new VueRouter({
  mode: 'history',
  routes,
});

export default Router;
