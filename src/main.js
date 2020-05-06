import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import echarts from 'echarts'
import ViewUI from 'view-design'
// import style
import 'view-design/dist/styles/iview.css'
import axios from 'axios'

Vue.use(ViewUI)
Vue.prototype.$axios = axios

Vue.prototype.$echarts = echarts
Vue.use(ElementUI)
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
