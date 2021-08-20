<template>
	<v-container>
		<v-row>
			<v-col cols="12">
			  <v-data-table
			    :headers="headers"
			    :items="ordenes"
			    sort-by="calories"
			    class="elevation-0"
			    :loading="loading"
			    loading-text="Cargando datos..."
			    :search="search"

			    >
			    <template v-slot:top>
			      <v-toolbar flat color="white">
			        <v-toolbar-title>Pedidos</v-toolbar-title>
			        <v-divider
			          class="mx-4"
			          inset
			          vertical
			        ></v-divider>
			        <v-text-field
			          v-model="search"
			          label="Buscar"
			          append-icon="search"
			          hide-details
			        ></v-text-field>
			        <v-spacer></v-spacer>
			        <v-btn color="primary" @click="initialize">Actualizar</v-btn>
			      </v-toolbar>
			    </template>


			    <template v-slot:item.estatus="{ item }">
			      <div class="orange--text" v-if="item.estatus == 0">Por validar</div>
			      <div class="yellow--text" v-if="item.estatus == 1">Cancelado</div>
			      <div class="primary--text" v-if="item.estatus == 2">Pagado</div>
			      <div class="green--text" v-if="item.estatus == 3">Autorizado</div>
			      <div class="red--text" v-if="item.estatus == 4">No Autorizado</div>
			    </template>



			    <template v-slot:item.actions="{ item }">
			    	<v-btn 
			    		small
			    		color="warning"
			    		@click="ver(item)">
			    		Ver detalle
			    	</v-btn>
			    </template>
			    <template v-slot:no-data>
			      <v-btn color="primary" @click="initialize">Reset</v-btn>
			    </template>
			  </v-data-table>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
	var numeral = require('numeral');
	var moment = require('moment')
	import {mapGetters} from 'vuex'
  export default {
    data: () => ({
    	search:'',
    	loading: true,
    	ordenes:[],
      headers: [
        {
          text: 'Folio',
          align: 'start',
          sortable: false,
          value: 'folio',
        },
        { text: 'Total', value: 'total'},
        { text: 'Divisa', value: 'divisa'},
        { text: 'Fecha', value: 'fecha'},
        { text: 'Estatus', value: 'estatus'},
        { text: 'Acciones', value: 'actions', sortable: false },
      ],
    }),

    created () {
    	moment.locale('es'); 
      this.initialize()
    },

    methods: {
      initialize () {
      	this.loading = true
      	this.ordenes = []
      	this.$http.get('ordenes.list').then(response=>{
      		this.ordenes = response.body
      		this.loading = false
      		this.ordenes.forEach(element=>{
      			element.fecha = moment(element.fecha).format('LL');
      			element.total = '$ ' + numeral(element.total).format('0,0.00')
      		})
      	}).catch(error=>{console.log(error)})
      },

      ver(pedido){
      	this.$router.push({name:'verpedido',params:{docum: pedido}})
      	console.log(pedido)
      }

    },

    computed:{
    	...mapGetters('login',['getdatosUsuario'])
    }
  }
</script>