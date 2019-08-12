// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import './assets/css/index.scss'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import {post, get, fileUpload} from './api/http'
//定义全局变量
Vue.prototype.$post = post;
Vue.prototype.$get = get;
Vue.prototype.$fileUpload = fileUpload;

router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
        if (store.state.token) {  // 通过vuex state获取当前的token是否存在
            next();
        }else {  // 如果没有权限,重定向到登录页,进行登录
            next({
                path: '/login',
                query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
        }
    }else {  // 不需要权限 直接跳转
      next();
    }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
