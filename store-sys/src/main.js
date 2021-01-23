import Vue from 'vue'
import App from './App.vue'
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import router from './router'

import * as echarts from 'echarts' //引入echarts
Vue.prototype.$echarts = echarts //挂载在原型，组件内使用直接this.$echarts调用

Vue.config.productionTip = false
Vue.use(ViewUI);

new Vue({
  el: '#app',
  router,  // 注入到根实例中
  render: h => h(App)
})