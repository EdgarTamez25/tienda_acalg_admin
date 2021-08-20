import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'

export default{
	namespaced: true,
	state:{
		registro:''
	},

	mutations:{

		ACTUALIZREGISTRO(state, registro){
			state.registro = registro
		}

	},

	actions:{

		// BUSCAR USUARIO
		buscarUsuarioWeb({commit, dispatch}, usuario){
			
			return new Promise((resolve, reject) => {
				
				const FormData = {'Email': usuario.email}
			
				Vue.http.post('api/v1/getidxmail',  FormData) 
					.then(respuesta=>{return respuesta.json()
				})
				
				.then(respuestaJson=>{
				// VALIDO LA RESPUESTA
			if(respuestaJson.idusuariosweb == ""){
				// SI NO ENCUENTRA AL USUARIO MANDA A REGISTRARLO
				resolve(true)

			}else{
				// SI ENCUENTRO AL USUARIO REGRESO FALSO
				resolve(false)
			}

			  }).catch(function(error){console.log('error',error)})
			})
		},

		registrarUsuario({commit}, usuario){
			return new Promise((resolve, reject) => {
				
				const payload = {
					Nomuser:      usuario.nomuser,
					Email:        usuario.email,
					Password:     usuario.password,
					// Idnivel :     '3',
					// Estatus: 	    "1",
					// Nivel:        "USER",
					// Telefono:     "",
					// Empresa:      "",
					// Depto:        "",
					// Suc:          "",
				}

				Vue.http.post('api/v1/usuariosweb',  payload) 
				.then(respuesta=>{ return respuesta.json() })
				
				.then(respuestaJson=>{
					if(respuestaJson === "Insertado correctamente"){
						resolve(true)

					}else{
						resolve(false)
					}

			  }).catch(function(error){console.log('error',error)})
			})
		},
	},

	getters:{
		
		traerDatosUsuarios(state){
			return state.registro
		}

	}
}