import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

import Home from '../views/Home.vue'
import Parks from '../views/parks/Index';
import Tickets from '../views/tickets/Index';
import Login from '../views/auth/Login';
import Register from '../views/auth/Register';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {   
          path: 'tickets', 
          name: 'Tickets',
          component: Tickets
      },
      {   
          path: 'park/:type', 
          name: 'Park',
          component: Parks,
      },  
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !store.getters['auth/isAuthenticated']) {
    if(to.name === 'Register') {
      next()
    } else next({name:'Login'})
  } else if (to.name === 'Login' && store.getters['auth/isAuthenticated']) {
    next({name:'Home'})
  }else next()
})

export default router
