import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/views/login/"
import Home from "@/views/home/"
import Layout from "@/views/layout/"
import Article from "@/views/article/"
import Image from "@/views/image/"
import Publish from "@/views/publish/"
import Comment from "@/views/comment/"
import Fans from "@/views/fans/"
import Setting from "@/views/setting/"


Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    // name: 'layout',
    component: Layout,
    children: [
      {
        path: '', // path为空 . 会作为默认子路由渲染 
        name: 'home',
        component: Home
      }, {
        path: '/article',
        name: 'article',
        component: Article
      }, {
        path: '/image',
        name: 'image',
        component: Image
      }, {
        path: '/publish',
        name: 'publish',
        component: Publish
      }, {
        path: '/comment',
        name: 'comment',
        component: Comment
      }, {
        path: '/fans',
        name: 'fans',
        component: Fans
      }, {
        path: '/setting',
        name: 'setting',
        component: Setting
      }
    ]
  },

]

const router = new VueRouter({
  routes
})
// 路由导航守卫，所有的页面都会经过这里
// 守卫页面的导航的,用于拦截页面，跟请求没关系
// to: 要去的页面路由信息
// from: 来自哪里的路由信息 
// next: 放行方法
router.beforeEach((to, from, next) => {
  // 如果要访问的页面不是 /login , 校验登录状态
  const user = JSON.parse(window.localStorage.getItem('user'))
  if (to.path !== "/login") {
    if (user) {
      // 登录了，直接放行
      next()
    } else {
      // 如果没有登录，则跳转到登录页
      next('/login')
    }
    // 如果登录了，则允许通过
  } else {
    // 允许通过
    next()
  }
})
export default router
