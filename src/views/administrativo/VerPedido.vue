<template>
	<v-container>
	  <v-row  justify="center" >
	  	<v-snackbar
        v-model="snackbar"
        :timeout="8000"
        top
        color="orange" dark
      >
        {{msg}}
        <v-btn
          color="white"
          text
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </v-snackbar>

	  	<v-col cols="12" xl="10" xs="12" >
		  	<v-card class="elevation-0">
		  		<v-card-text >
			  		<v-row>	 
			  		  <!-- Imageb y botones de pagar, cotizar e imprimir -->
					  	<v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12">
					  		<v-card class="elevation-0 transparent" align="left">
					  		  <v-row >
					  		    <v-col cols="12" xl="6" lg="6" md="6" sm="6" xs="12">
					  		  		<v-img :src="logo" alt="alt"  width="175"></v-img>
					  		    </v-col>
					  		    <v-col cols="12" xl="6" lg="6" md="6" sm="6" xs="12" v-if="iddocum.estatus == 0">
					  		    	<v-card-actions >
					  		    		<v-spacer></v-spacer>
										    <v-btn color="green darken-3" dark @click="actualizar(3)" >Autorizar</v-btn>
										    <v-btn color="amber darken-3" dark @click="dialog = true" >No autorizar</v-btn>
					  		    	</v-card-actions>
					  		    </v-col>

					  		    <v-col cols="12" xl="6" lg="6" md="6" sm="6" xs="12" v-else>
					  		    	<div class="orange--text" v-if="iddocum.estatus == 0"><h1>Por validar</h1></div>
								      <div class="yellow--text" v-if="iddocum.estatus == 1"><h1>Cancelado</h1></div>
								      <div class="yellow--text" v-if="iddocum.estatus == 2"><h1>Pagado</h1></div>
								      <div class="green--text" v-if="iddocum.estatus == 3"><h1>Autorizado</h1></div>
								      <div class="red--text" v-if="iddocum.estatus == 4"><h1>No Autorizado</h1></div>
					  		    </v-col>
					  		  </v-row>
					  		</v-card>
					  	</v-col>

					  	<!-- Datos de la tienda -->
					  	<v-col cols="12" xl="6" lg="6" md="6" sm="6" xs="12">
					  	  <v-card class="elevation-0">
					  	    <v-card-text class="py-0">
					  	    	<div class="text-xs-left "><strong>{{ tienda.nomcia }}</strong></div>
					  	    	<div class="text-xs-left "><strong>{{ tienda.rfccia }}</strong></div>
					  	    	<div class="text-xs-left ">{{ direccionCia }}</div>
					  	    	<div class="text-xs-left ">{{ tienda.email }}</div>
					  	    	<div class="text-xs-left ">{{ tienda.telefono }}</div>
					  	    </v-card-text>
					  	  </v-card>
					  	</v-col>

					  	<!-- Nota -->
							<v-col cols="12" xl="6" lg="6" md="6" sm="6" xs="12">
				  			<v-card class="elevation-0">
					  		  <v-card-text>
					  		    <div class="text-xs-left "><strong>Folio: </strong>{{ documento.folio }}</div>
					  		    <div class="text-xs-left "><strong>Fecha: </strong>{{ documento.fecha }}</div>
					  		    <div class="text-xs-left "><strong></strong>Cotización</div>
					  		    <div class="text-xs-left "><strong>Divisa: </strong>MXN</div>
					  		  </v-card-text>
					  		</v-card>
					  	</v-col>

					  	<!-- Datos del cliente -->
					  	<v-col cols="12" xl="6" lg="6" md="6" sm="6" xs="12">
					  		<v-card class="elevation-0">
					  		  <v-card-text >
					  		    <div class="text-xs-left "><strong>Datos del cliente</strong></div>
					  		    <div class="text-xs-left "><strong>{{ usuario.rfc }}</strong></div>
					  		    <div class="text-xs-left ">{{ usuario.nomcomer }}</div>
					  		    <div class="text-xs-left ">{{ documento.direccion }}</div>
					  		    <div class="text-xs-left ">{{ usuario.telefono }}</div>
					  		    <div class="text-xs-left ">{{ usuario.email }}</div>
					  		  </v-card-text>
					  		</v-card>
					  	</v-col>

					  	<!-- Dirección de envío -->
					  	<v-col cols="12" xl="6" lg="6" md="6" sm="6" xs="12">
				  			<v-card class="elevation-0">
				  				<v-card-text>
					  				<v-radio-group v-model="radios" :mandatory="false" row >
								      <v-radio label="Envío a domicilio" value="2" color="primary"></v-radio>
							      </v-radio-group>
							      <div>
							      	{{ documento.direccion }}
							      </div>

					  		  </v-card-text>
					  		</v-card>
					  	</v-col>

					  	<!-- Tabla de articulos -->
						 	<v-col cols="12" xs="12" class="pa-2">
						 		<v-divider></v-divider> 
							  <template>
						    	<v-data-table
						      	:headers="headers"
						      	:items="documento.movim"
						      	fixed-header
                		class="elevation-1 pa-0 text-xs-center"
						      	hide-default-footer
						    	>
						    		
						    		<template v-slot:item.foto="{ item }">
								      <v-img :src="url + item.foto" contain aspect-ratio="2"/>
								    </template>

							    </v-data-table>
								</template>
						 	</v-col>
			  		</v-row>
			  		<v-row justify="end">
			  			<v-col cols="12" xl="3" lg="4" md="6" sm="6" xs="12">
							  <v-row >
				    		  <v-col cols="6">
				    		  	<v-card class="transparent elevation-0">
				    		  	  <v-card-text>
				    		  	  	<div class="text-xs-left "><h3><strong>Importe:</strong></h3></div>
						    		    <div class="text-xs-left "><h3><strong>Descuento:</strong></h3></div>
						    		    <div class="text-xs-left "><h3><strong>Subtotal:</strong></h3></div>
						    		    <!-- <div class="text-xs-left "><h3><strong>Iva:</strong></h3></div> -->
						    		    <div class="text-xs-left "><h3><strong>Total:</strong></h3></div>
				    		  	  </v-card-text>
				    		  	</v-card>
				    		  </v-col>

				    		  <v-col cols="6">
				    		    <v-card class="transparent elevation-0">
				    		  	  <v-card-text align="right">
				    		  	  	<div class="text-xs-left "><h3><strong>{{ documento.importe }}</strong></h3></div>
						    		    <div class="text-xs-left "><h3><strong>{{	documento.descuento }}</strong></h3></div>
						    		    
						    		    <div class="text-xs-left "><h3><strong>{{ documento.subtotal }}</strong></h3></div>
						    		    <!-- <div class="text-xs-left "><h3><strong>{{ iva}}</strong></h3></div> -->
						    		    <div class="text-xs-left "><h3><strong>{{ documento.total }}</strong></h3></div>
				    		  	  </v-card-text>
				    		  	</v-card>
				    		  </v-col>
							  </v-row>
					  	</v-col>
			  		</v-row>
		  		</v-card-text>
		  	</v-card>
	  	</v-col>
	  </v-row>

	  <v-dialog
	    v-model="dialog"
	    persistent 
	    :overlay="false"
	    max-width="500px"
	    transition="dialog-transition"
	  >
	    <v-card>
	    	<v-card-title primary-title>
	    	  Ingresa la razón por la cual no se puede autorizar el pedido
	    	</v-card-title>
	    	<v-card-text>
	    	  <v-textarea
	    	    v-model="nota"
	    	    label="Escribe aquí la razón"
	    	    outlined
	    	  ></v-textarea>
	    	</v-card-text>
	    	<v-card-actions>
	    		<v-spacer></v-spacer>
	    	  <v-btn color="primary" @click="actualizar(4)">Enviar</v-btn>
	    	  <v-btn color="secondary"@click="dialog=false">Cancelar</v-btn>
	    	</v-card-actions>
	    </v-card>
	  </v-dialog>	
	  <!-- COMPROBANTE -->
  </v-container>	
</template>

<script>

	import {mapActions, mapGetters} from 'vuex'
	
	export default{

		data(){
			return{
				nota:'',
				dialog:false,

				documento:[],
				iddocum:'',
				usuario:[],

				url: this.$http.options.root + 'fotos/',

				direccionCia:'',
				tienda:{},

				logo:'',

				msg:'',
				snackbar: false,

				radios: '2',

	      headers: [
	        { text: 'codigo'			  ,align: 'left', 	value: 'codigo'	,   	sortable: false },
	        { text: 'Foto'			  ,align: 'center', value: 'foto'	,     	sortable: false },
	        { text: 'Descripción' ,align: 'left', 	value: 'descrip',   	sortable: false },
	        { text: 'Cant'	      ,align: 'center', value: 'cantidad',  	sortable: false },
	        
	        { text: 'Precio'		  ,align: 'center', value: 'precio'  ,  	sortable: false },
	        { text: 'Descuento'	  ,align: 'center', value: 'descuento',   sortable: false },
	        { text: 'Neto'		  	,align: 'center', value: 'neto'  , 		sortable: false },
	      ],
			}
		},

		computed: {
      ...mapGetters('login',['getdatosUsuario']),
    },

    created () {
    	console.log(this.$route.params)
    	this.init()
    },

    methods: {
      init(){
      	this.iddocum = this.$route.params.docum
      	this.getDatosfiscales()
      	this.getDocum()
      	this.getLogo()
      },

      getLogo(){
      	this.$http.get('config.list').then(response=>{
          var ciaws = response.body
          this.logo = this.$http.options.root + 'fotos/' + ciaws.logourl
        }, error => {
          console.log(error)
        })
      },

      getDatosfiscales(){
      	this.$http.get('tienda/datosfiscales').then(response=>{
	    		this.tienda = response.body[0]
	    		this.direccionCia  = this.tienda.calle + ', ' + this.tienda.numext + ', ' + this.tienda.colonia + ', ' + this.tienda.ciduad + ', ' + this.tienda.estado + ', ' + this.tienda.cp
	    	}, error => {console.log(error)})

	    	this.$http.get('datosfiscales.usuario/' + this.iddocum.idusuariosweb).then(response=>{
	    		this.usuario = response.body[0]
	    	}, error => {console.log(error)})

      },

    	getDocum(){
	    	// console.log("movim_array", this.movin_array)
        this.$http.get('ordenes.id/' + this.iddocum.iddocum).then(response=>{
        	this.documento = response.body
        	console.log(response.body)
        }).catch(function(error){
          console.log(error)
        })
    	},

    	actualizar(estatus){
    		this.dialog = false
    		this.iddocum.estatus = estatus
    		this.iddocum.nota = this.nota
    		this.$http.put('ordenes.update/' +this.iddocum.iddocum, this.iddocum).then(response=>{
          this.msg = 'Pedido Autorizado'
          this.snackbar = true
    			this.nota = ''

					setTimeout(() => (this.$router.push({name: 'pedidos'})), 3000)
        }, error => {
          console.log(error)
        })
    		console.log(this.documento)
    	}
    }
  }
</script>
