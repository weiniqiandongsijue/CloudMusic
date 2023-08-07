//Vue
import Vue from 'vue'

import App from './App.vue'
//vuex
import store from './store'
//vue-router
import router from './router'
//vant
import getVant from './plugins'

//关闭vue生产提示
Vue.config.productionTip = false

getVant(Vue)

new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')
