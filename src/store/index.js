import Vue from 'vue'
import Vuex from 'vuex'

import auth from './modules/auth'
import park from './modules/park'
import ticket from './modules/ticket'

//components
import snackbar from './modules/snackbar'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    park,
    snackbar,
    ticket,
  }
})
