import Vue from 'vue'
import Vuex from 'vuex'

import router   from '@/router'

import Login     from '@/modules/Login/Login'
import Registro  from '@/modules/Login/Registro'	
import productos from '@/modules/productos'
import tema      from '@/modules/tema'
import  createPersistedState  from  'vuex-persistedstate'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  	
  },
  mutations: {

  },
  actions: {
  	
  },

  getters:{
		
	},

	modules:{
		Login,
		Registro,
		productos,
		tema
	},
	plugins: [createPersistedState()]

})

