<template>
	<v-container>
	  <v-row>
	  	<v-col cols="12" xl="6" lg="6" md="6" sm="10" xs="12">
	  		<v-card>
	  		  <v-card-title primary-title>
	  		    Nuevo adeudo
	  		    <v-spacer></v-spacer>
	  		    <v-btn color="warning" small :to="{name:'catpagos'}">Regresar</v-btn>
	  		    <v-divider></v-divider>
	  		    <v-btn color="primary" small @click="guardar">Guardar</v-btn>
	  		  </v-card-title>
	  		  <v-card-text>
	  		    <v-select
	  		      dense
              outlined
              :items="clientes"
              v-model="cliente"
              item-text="nomcli"
              item-value="idweb" 
              label="Cliente"
              persistent-hint
              single-line
              hide-details
              return-object
	  		    ></v-select>
	  		    <v-text-field
	  		      label="Importe"
	  		      v-model="importe"
	  		      type="number"
	  		    ></v-text-field>
	  		    <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              :return-value.sync="fechalim"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="fechalim"
                  label="Fecha Limite de pago"
                  prepend-icon="event"
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="fechalim" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                <v-btn text color="primary" @click="$refs.menu.save(fechalim)">OK</v-btn>
              </v-date-picker>
            </v-menu>
	  		    <v-textarea outlined v-model="concepto" label="concepto"></v-textarea>
	  		  </v-card-text>
	  		</v-card>
	  	</v-col>
	  </v-row>
	  <v-snackbar
	    v-model="snackbar"
	    :color="color"
	    top
	  >
	    {{text}}
	    <v-btn text  @click.native="snackbar = false">Close</v-btn>
	  </v-snackbar>
	</v-container>
</template>
<script>
	export default{
		data:()=>({
			snackbar:false,
			text:'',
			color:'',

			clientes:[],
			cliente: {idweb: '', nomcli:''},

			importe:'',
			concepto:'',
			fechalim: new Date().toISOString().substr(0, 10),
			fecha: new Date().toISOString().substr(0, 10),

			menu: false,

		}),

		created(){
			this.getClientes()
		},

		methods:{
			getClientes(){
				this.$http.post('clientes.list').then(response=>{
					this.clientes = response.body
					// console.log(response.body)
				}).catch(error=>{
					console.log(error)
				})
			},

			guardar(){
				console.log(this.cliente)
				var payload = {
					idcliente: this.cliente.idweb,
					importe: this.importe,
					fechalim: this.fechalim,
					fecha: this.fecha,
					concepto: this.concepto
				}
				console.log(payload)
				this.$http.post('pagos.add', payload).then(response=>{
					this.text = 'Adeudo Agregado correctamente'
					this.color = 'success'
					this.snackbar=true
					// console.log(response.body)
					setTimeout(() => (this.$router.push({name: 'catpagos'})), 1500)
				}).catch(error=>{
					this.text = 'Adeudo  NO Agregado'
					this.color = 'error'
					this.snackbar = true
					console.log(error)
				})
			}
		}
	}
</script>