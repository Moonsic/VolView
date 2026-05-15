import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 前置守卫
router.beforeEach((to, from, next) => {
  if (to.path !== from.path) {
    document.title = t(`${to.meta.title || to.path}`)
  }

  // 可以对权限进行一些校验
  const permissList = JSON.parse(localStorage.getItem('permissList')) || []
  if(to.meta.permiss && !permissList.includes(to.meta.permiss)) {
    next({name: '403'})
    return
  }

  next()
  return
})

// 后置守卫
// router.afterEach((to, from) => {
// })
export default router
