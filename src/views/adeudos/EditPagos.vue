<template>
	<v-container>
	  <v-row>
	  	<v-col cols="12" xl="6" lg="6" md="6" sm="10" xs="12">
	  		<v-card>
	  		  <v-card-title primary-title>
	  		    Editar adeudo
	  		    <v-spacer></v-spacer>
	  		    <v-btn color="warning" small :to="{name:'catpagos'}">Regresar</v-btn>
	  		    <v-divider></v-divider>
	  		    <v-btn color="primary" small @click="guardar">Guardar</v-btn>
	  		  </v-card-title>
	  		  <v-card-text>
	  		    <v-select
	  		      :items="clientes"
              v-model="cliente"
              :hint="` ${cliente.idweb}`"
              item-text="nomcli"
              item-value="clientes" 
              label="Cliente"
              persistent-hint
              return-object
              single-line
	  		    ></v-select>
	  		    <v-text-field
	  		      label="Importe"
	  		      v-model="pagos.importe"
	  		      type="number"
	  		    ></v-text-field>
	  		    <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              :return-value.sync="pagos.fechalim"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="pagos.fechalim"
                  label="Fecha Limite de pago"
                  prepend-icon="event"
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="pagos.fechalim" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                <v-btn text color="primary" @click="$refs.menu.save(pagos.fechalim)">OK</v-btn>
              </v-date-picker>
            </v-menu>
	  		    <v-textarea outlined v-model="pagos.concepto" label="concepto"></v-textarea>
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

			pagos:[],

		}),

		created(){

			this.getClientes()
		},

		methods:{
			getClientes(){
				this.$http.post('clientes.list').then(response=>{
					this.clientes = response.body
					this.init()
					// console.log(response.body)
				}).catch(error=>{
					console.log(error)
				})
			},

			init(){
				this.$http.get('pagos/'+this.$route.params.id).then(response=>{
					this.pagos = response.body[0]
					this.cliente = {idweb: this.pagos.idcliente , nomcli: this.pagos.nomcli}
					// console.log(response.body)
				}).catch(error=>{
					console.log(error)
				})

			},


			guardar(){
				var payload = {
					idpagos: this.pagos.idpagos,
					idcliente: this.cliente.idweb,
					importe: this.pagos.importe,
					fechalim: this.pagos.fechalim.substr(0, 10),
					fecha: this.pagos.fecha.substr(0, 10),
					concepto: this.pagos.concepto
				}
				// console.log(payload)

				this.$http.put('pagos.update', payload).then(response=>{
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