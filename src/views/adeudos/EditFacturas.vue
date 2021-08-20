<template>
	<v-container>
	  <v-row>
	  	<v-col cols="12" xl="6" lg="6" md="6" sm="10" xs="12">
	  		<v-card>
	  		  <v-card-title primary-title>
	  		    {{tipo}} Factura
	  		    <v-spacer></v-spacer>
	  		    <v-btn color="warning" small @click="regresar">Regresar</v-btn>
	  		    <v-divider></v-divider>
	  		    <v-btn color="primary" small @click="guardar">Guardar</v-btn>
	  		  </v-card-title>
	  		  <v-card-text>
	  		  	<v-text-field
	  		      label="# Factura"
	  		      v-model="facturas.numfact"
	  		      :readonly="readonly"
	  		    ></v-text-field>
	  		    <v-text-field
	  		      label="Importe"
	  		      v-model="facturas.importe"
	  		      type="number"
	  		      :readonly="readonly"
	  		    ></v-text-field>
	  		    <v-menu
	  		    	:readonly="readonly"
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              :return-value.sync="fvenc"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }" :readonly="readonly">
                <v-text-field
                  :readonly="readonly"
                  v-model="facturas.fvenc"
                  label="Fecha Limite de pago"
                  prepend-icon="event"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="facturas.fvenc" no-title scrollable :readonly="readonly">
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                <v-btn text color="primary" @click="$refs.menu.save(facturas.fvenc)">OK</v-btn>
              </v-date-picker>
            </v-menu>
	  		    <v-textarea outlined v-model="facturas.concepto" label="concepto"></v-textarea>
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
			tipo:'',
			readonly: false,
			facturas:[],
			idfacturas: '',
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

		created () {
			this.readonly = this.$route.params.read
			this.readonly == true ? (this.tipo = 'Ver') : (this.tipo = 'Editar')
      this.idfacturas = this.$route.params.id
      this.consultar(this.idfacturas)
    },

		methods:{
			consultar(idfacturas){
				this.$http.get('facturas/'+ idfacturas).then(response=>{
					this.facturas = response.body[0] 
					this.facturas.estatus == 1 ? (this.switch1=true) : (this.switch1=false)
					this.facturas.fecha.substr(0, 10)
					this.facturas.fpago.substr(0, 10)
					this.facturas.fvenc.substr(0, 10)
					console.log(response.body)
				}).catch(error=>{
					console.log(error)
				})
			},

			regresar(){
				this.$router.push({name:'catfacturas', params: {id: this.$route.params.regresar}})
			},

			guardar(){
				

				var payload = {
					idfacturas: this.idfacturas,
					idpagos: this.$route.params.id,
					numfact: this.facturas.numfact,
					importe: this.facturas.importe,
					fvenc: this.facturas.fvenc.substr(0, 10),
					fecha: this.fecha.substr(0, 10),
					concepto: this.facturas.concepto,
					estatus: this.switch1
				}
				// console.log(payload)

				this.$http.put('facturas.update', payload).then(response=>{
					this.text = 'Factura Actualizada correctamente'
					this.color = 'success'
					this.snackbar=true
					// console.log(response.body)
					this.$router.push({name:'catfacturas', params: {id: this.$route.params.id}})
				}).catch(error=>{
					this.text = 'Factura  NO Actualizada'
					this.color = 'error'
					this.snackbar = true
					console.log(error)
				})
			}
		}
	}
</script>