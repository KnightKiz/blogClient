import Vue from 'vue';
import Router from 'vue-router';
import main from '../components/Main/Main';
import detail from '../components/Detail/Detail';
import edit from '../components/Edit/Edit';
import login from '../components/Login/Login';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'main',
      component: main
    },
    {
      path: '/article/:id',
      name: 'detail',
      component: detail
    },
    {
      path: '/KnightKiz/edit',
      name: 'edit',
      component: edit
    },
    {
      path: '/KnightKiz/login',
      name: 'login',
      component: login
    }
  ]
});
