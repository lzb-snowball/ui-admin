// import Vue from 'vue'
// import Router from 'vue-router'
import store from '@/store'
import Layout from '@/layout/index'
// import App2 from "@/App2.vue";

export const constantRoutes = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true, meta: { ignoreAuth: true }},
  { path: '/404', component: () => import('@/views/error-page/404'), hidden: true, meta: { ignoreAuth: true }},
  { path: '/401', component: () => import('@/views/error-page/401'), hidden: true, meta: { ignoreAuth: true }},
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/dashboard', component: () => import('@/views/dashboard'), hidden: true, meta: { ignoreAuth: true, title: '面板' }},
      { path: '/sys/authDict2', component: () => import('@/views/sys/authDict'), meta: { title: '字典管理' }},
      { path: '/content/country2', component: () => import('@/views/content/country'), meta: { title: '国家管理' }},
      { path: '/content/posterCode', component: () => import('@/views/content/posterCode'), meta: { title: '文章编号' }},
      { path: '/content/bannerType', component: () => import('@/views/content/bannerType'), meta: { title: '导航广告栏类型' }},
      { path: '/sys/password', component: () => import('@/views/sys/password'), meta: { title: '修改密码' }},
    ]
  },
]

const router = new VueRouter({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
router.beforeEach((to, from, next) => {
  // console.log('beforeEach from.path', from.path)
  if (to.path === '/') {
    const authRouteList = store.get('authRouteList')
    if (authRouteList.length) {
      const componentPath = authRouteList.filter(r => r.type === 'MENU')[0].componentPath
      // console.log('beforeEach componentPath',componentPath)
      return next(componentPath)
    }
  }
  store.get('token')
  if (!to.meta.ignoreAuth && !store.get('token')) {
    return next('login')
  } else {
    next()
  }
})
export default router

