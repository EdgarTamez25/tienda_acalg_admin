import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'
import vuetify from '@/plugins/vuetify';

export default{
	namespaced: true,
	state:{
		login:false,
		datosUsuario:'',
		idusuariosweb: '',
	},

	mutations:{
		LOGEADO(state, value){
			state.login = value
		},
		DATOS_USUARIO(state, datosUsuario){
      state.datosUsuario = datosUsuario
		},
		ID_USUARIO(state, idusuariosweb){
			state.idusuariosweb = idusuariosweb
		},

		SALIR(state){
			state.login = false
			state.datosUsuario = ''
			state.idusuariosweb =  ''
		}
	},

	actions:{
		// Valida si el usario existe en la BD
		validarUser({commit}, usuario){
			return new Promise((resolve, reject) => {
			 // console.log (usuario)
			  Vue.http.post('sessions', usuario).then(respuesta=>{
			  	return respuesta.json()
			  }).then(respuestaJson=>{
	         // console.log('respuestaJson',respuestaJson)
					if(respuestaJson == null){
						resolve(false) 

					}else{
						resolve(respuestaJson) 
        	}
      	}, error => {
        	reject(error)
      	})
			})
		},

		GetInfoUser({commit, dispatch}, usuario){
			return new Promise((resolve, reject) => {
			  Vue.http.post('sessions', usuario).then(respuesta=>{
	        console.log('respuesta',respuesta)
					if(respuesta.body.length < 1){
						resolve(false) 
					}else{
						if(respuesta.body.estatus == 1){
							resolve('Valida tu correo') 
						}else if(respuesta.body.nivel != 'ADMIN'){
							resolve('No tienes acceso a este nivel')
						}else{
	        		commit('DATOS_USUARIO',respuesta.body)
							commit('LOGEADO', true)
							resolve(true)
						}
	      	}
	    	}, error => {
	      	resolve(false)
	    	})
			})
		},



		salirLogin({commit}){
			commit('SALIR')
		},
	},

	getters:{
		getLogeado(state){
		  return state.login
		},
		getdatosUsuario(state){
			return state.datosUsuario
		},

		getidUsuariosWeb(state){
			return state.idusuariosweb
		},

	}
}