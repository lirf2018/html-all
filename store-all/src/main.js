import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
/* import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; */
import router from './router'
import store from './store'

import VueBarcode from '@chenfengyuan/vue-barcode'; /* 导入条形码插件 */
Vue.component('barcode', VueBarcode); /* 声明条形码组件 */
import QRCode from 'qrcodejs2';

import Vant from 'vant';
import 'vant/lib/index.css';

Vue.config.productionTip = false
Vue.use(Vant);
Vue.use(Vuex);
//已写好的商品项目使用的是vant
// new Vue({
//   render: h => h(App),
// }).$mount('#app')

new Vue({
	el: '#app',
	router, // 注入到根实例中
	store,
	render: h => h(App)
})

router.beforeEach((to, from, next) => {
	//next({path: '/'})
	// 1. 判断是不是登录页面
	// 是登录页面
	if (to.path === '/phoneLogin') {
		next()
	} else {
		// 不是登录页面
		// 2. 判断 是否登录过
		let token = localStorage.getItem('Authorization');
		token !='' && token != null && token ? next() : next('/phoneLogin')
	}
})


/* router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
        if (store.state.token) {  // 通过vuex state获取当前的token是否存在
            next();
        }
        else {
            next({
                path: '/login',
                query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
            })
        }
    }
    else {
        next();
    }
}) */