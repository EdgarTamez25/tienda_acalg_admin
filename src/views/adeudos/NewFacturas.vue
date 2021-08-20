<template>
	<v-container>
	  <v-row>
	  	<v-col cols="12" xl="6" lg="6" md="6" sm="10" xs="12">
	  		<v-card>
	  		  <v-card-title primary-title>
	  		    Nueva Factura
	  		    <v-spacer></v-spacer>
	  		    <v-btn color="warning" small @click="regresar">Regresar</v-btn>
	  		    <v-divider></v-divider>
	  		    <v-btn color="primary" small @click="guardar">Guardar</v-btn>
	  		  </v-card-title>
	  		  <v-card-text>
	  		  	<v-text-field
	  		      label="# Factura"
	  		      v-model="numfact"
	  		    ></v-text-field>
	  		    <v-text-field
	  		      label="Importe"
	  		      v-model="importe"
	  		      type="number"
	  		    ></v-text-field>
	  		    <!-- <v-switch
				      v-model="switch1"
				      label="Pagada"
				    ></v-switch> -->
	  		    <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              :return-value.sync="fvenc"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="fvenc"
                  label="Fecha Limite de pago"
                  prepend-icon="event"
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="fvenc" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                <v-btn text color="primary" @click="$refs.menu.save(fvenc)">OK</v-btn>
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
			switch1: true,
			snackbar:false,
			text:'',
			color:'',

			numfact:'',
			importe:'',
			concepto:'',
			fvenc: new Date().toISOString().substr(0, 10),
			fecha: new Date().toISOString().substr(0, 10),

			menu: false,

		}),

		methods:{
			guardar(){
				this.switch1 == true ? (this.switch1=1) : (this.switch1=2)
				var fechapago2
				this.switch1 == true ? (fechapago2=this.fecha) : (fechapago2='')

				var payload = {
					idpagos: this.$route.params.id,
					numfact: this.numfact,
					importe: this.importe,
					fvenc: this.fvenc,
					fecha: this.fecha,
					fpago: fechapago2,
					concepto: this.concepto,
					estatus: this.switch1
				}
				// console.log(payload)

				this.$http.post('facturas.add', payload).then(response=>{
					this.text = 'Factura Agregada correctamente'
					this.color = 'success'
					this.snackbar=true
					// console.log(response.body)
					this.$router.push({name:'catfacturas', params: {id: this.$route.params.id}})
				}).catch(error=>{
					this.text = 'Factura  NO Agregada'
					this.color = 'error'
					this.snackbar = true
					console.log(error)
				})
			},

			regresar(){
				this.$router.push({name:'catfacturas', params: {id: this.$route.params.id}})
			},
		}
	}
</script>