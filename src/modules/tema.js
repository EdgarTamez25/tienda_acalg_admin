import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'
import vuetify from '@/plugins/vuetify';


export default{
	namespaced: true,
	state:{
		tema:[],
	},

	mutations:{
		TEMA(state, value){
			state.tema = value
		},
	},

	actions:{
		//Función para cargar los avisos de
		traerTema({commit, dispatch}){
			//retornar una promesa (resolve, rejecet)
			return new Promise((resolve, reject) => {
			  Vue.http.get('api/v1/tema.list/' + 1).then(respuesta=>{
	      	commit('TEMA',respuesta.body)
	      	dispatch('configTema',respuesta.body)
	      	resolve(true) 
		    }).catch(function(error){console.log('error',error)})
      })
		},

		configTema({},colores){
			if(colores.primario != '' && colores.primario != undefined){
        vuetify.framework.theme.themes.light.primary = colores.primario
      }

      if(colores.secundario != '' && colores.secundario != undefined){
        vuetify.framework.theme.themes.light.secondary = colores.secundario
      }

      if(colores.Success != '' && colores.Success != undefined){
        vuetify.framework.theme.themes.light.success = colores.Success
      }

      if(colores.Info != '' && colores.Info != undefined){
        vuetify.framework.theme.themes.light.info = colores.Info
      }

      if(colores.errores != '' && colores.errores != undefined){
        vuetify.framework.theme.themes.light.error = colores.errores
      }

      if(colores.Warningn != '' && colores.Warningn != undefined){
        vuetify.framework.theme.themes.light.warning = colores.Warningn
      }

		},
	 
		
  },

	getters:{
		getTema(state){
		  return state.tema
		},

		
	}
}