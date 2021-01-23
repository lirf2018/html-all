import Vue from 'vue'
import App from './App.vue'
/* import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; */
import router from './router'

import VueBarcode from '@chenfengyuan/vue-barcode'; /* 导入条形码插件 */
Vue.component('barcode', VueBarcode);  /* 声明条形码组件 */
import QRCode from 'qrcodejs2';

import Vant from 'vant';
import 'vant/lib/index.css';

Vue.config.productionTip = false
Vue.use(Vant);
//已写好的商品项目使用的是vant
// new Vue({
//   render: h => h(App),
// }).$mount('#app')

new Vue({
  el: '#app',
  router,  // 注入到根实例中
  render: h => h(App)
})

/* router.beforeEach((to, from, next) => {
  next({path: '/'})
}) */