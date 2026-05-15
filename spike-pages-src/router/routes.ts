import { RouteRecordRaw } from 'vue-router'
import { indexPage } from './indexPage'
// import { screenPage } from './screenPage' // 用不到

const routes: RouteRecordRaw[] = [
  // 重定向到index
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    name: 'index',
    meta: {
      title: ['首页'],
    },
    component: () => import('@v/IndexTop.vue'),  // 菜单在顶部
    // component: () => import('@v/demo/IndexLeft.vue'), // 菜单在左侧
    children: [
      ...indexPage,
    ],
  },
  // screenPage, // 用不到
  {
    path: '/login',
    name: 'login',
    meta: {
      title: ['登录'],
    },
    component: () => import('@v/login/Index.vue')
  },
  // {
  //   path: '/login2',
  //   name: 'login2',
  //   meta: {
  //     title: ['登录'],
  //   },
  //   component: () => import('@v/demo/loginOld/Index.vue')
  // },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    meta: {
      title: ['404'],
    },
    component: () => import('@v/errorPage/404.vue')
  },

]

export default routes
