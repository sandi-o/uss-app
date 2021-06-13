import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'

axios.defaults.withCredentials = true
axios.defaults.baseURL = "http://localhost:8000"

//prototypes
Vue.prototype.$http = axios

Vue.component('the-app-snackbar', require('./components/TheSnackBar.vue').default);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
