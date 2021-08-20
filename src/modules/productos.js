import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'

export default{
	namespaced: true,
	state:{
		productos:[],
		producto:'',
		entrada:'',
		idimg:'',
		exis:'',
		lab:'',
	},

	mutations:{
		PRODUCTOS(state, value){
			state.productos = value
		},

		PRODUCTO(state, value){
			state.producto = value
		},

		ENTRADA(state, value){
			state.entrada = value
		},

		EXISTENCIA(state, value){
			state.exis = value
		},

		LAB(state, value){
			state.lab = value
		},

		
	},

	actions:{
		//Función para cargar los avisos de
		traerProductos({commit, dispatch}, usuario){
			//retornar una promesa (resolve, rejecet)
			return new Promise((resolve, reject) => {
			  Vue.http.get('articulos.list')
				.then(respuesta=>{return respuesta.json()})
				.then(respuestaJson=>{
					
					console.log('Productos', respuestaJson)
					if(respuestaJson == null){
						resolve(null) 
					}else{
		      	commit('PRODUCTOS',respuestaJson)
		      	resolve(true) 
					}
		    }, error => {
        	reject(error)
      	})
      })
		},

		editLab({commit, dispatch}, lab){
			return new Promise((resolve, reject) => {
				commit('LAB',lab)
				resolve(true)
			})
		},

		verProducto({commit, dispatch}, producto){
			commit('PRODUCTO',producto)
		},

		verExis({commit, dispatch}, exis){
			return new Promise((resolve, reject) => {
				commit('EXISTENCIA',exis)
				resolve(true)
			})
		},


		verEntrada({commit, dispatch}, entrada){
			commit('ENTRADA',entrada)
		},


	 
		
  },

	getters:{
		getProductos(state){
		  return state.productos
		},

		getProducto(state){
		  return state.producto
		},

		getEntrada(state){
		  return state.entrada
		},

		getExistencia(state){
		  return state.exis
		},

		getLab(state){
		  return state.lab
		},

		
	}
}