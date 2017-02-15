import VueRouter from 'vue-router';
import Docs from './components/Docs';
// import Edit from './components/Edit';
import LogIn from './components/LogIn';
import SignUp from './components/SignUp';
import View from './components/View';
import WysiwygEditor from './components/WysiwygEditor';

// Promise me, URL must look like /:Action/Directory
const routes = [
  { path: '/', component: LogIn },
  { path: '/signup', component: SignUp },
  { path: '/docs/:path*', component: Docs },
  { path: '/view/:path*', component: View },
  { path: '/edit/:path*', component: WysiwygEditor },
];

const Router = new VueRouter({
  mode: 'history',
  routes,
});

Router.beforeEach((to, from, next) => {
  if (to.hash.indexOf('#!') === 0 && to.path === '/') {
    return next(to.hash.substring(2));
  }
  return next();
});

export default Router;
