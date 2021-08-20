<template>
	<v-container>
	  <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Nuevo pago por factura</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="importe" label="Importe"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="importe = 0, dialog = false">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
	  <v-data-table
	    :headers="headers"
	    :items="pagoxfac"
	    item-key="numfact"
	    class="elevation-1"
	    :loading="loading" 
	    :search="search"
	    :items-per-page="longitud"
	    hide-default-footer
	    fixed-header
	    height="350"

	  >
	    <template v-slot:top>
	      <v-toolbar flat>
	        <v-toolbar-title>Pagos x facturas</v-toolbar-title>
	        <v-spacer></v-spacer>
	        <v-text-field
	          v-model="search"
	          append-icon="search"
	          label="Buscar Factura"
	          single-line
	          hide-details
	        ></v-text-field>
	        
	        <v-spacer></v-spacer>

	        <v-btn align="right" 
	          color="secondary" dark small
	          class="ma-2" 
	          @click="regresar">Regresar
	        </v-btn>

	      
	        <!-- //NUEVO -->
	        <v-btn align="right" 
	          color="primary" dark small
	          class="ma-2" 
	          @click="dialog = true">Nuevo
	        </v-btn>


	        <!-- BOTON EXCEL -->
	        <v-btn
	          class='ma-2' 
	          small dark color= "warning"
	          @click="exportar()">
	          <v-icon>save_alt</v-icon>
	        </v-btn>
	      </v-toolbar>
	    </template>

	    <template v-slot:item.estatus="{ item }">
	      <v-chip v-if="item.estatus==1" color="success" small>Pagada</v-chip>
	      <v-chip v-else dark color="warning" small>Pendiente</v-chip>
	    </template>

	    <template v-slot:item.actions="{ item }">
	      <v-btn icon @click="eliminar(item.idfacturas)"><v-icon>delete</v-icon></v-btn>
	    </template>
	  </v-data-table>
	  <div v-if="pagoxfac.length > 0">
	  	<v-card>
		  	<v-card-text align="right">
		  	  <div><h3>Total: ${{ pagoxfac[0].total }}</h3></div>
		  	  <div><h3>Faltante: ${{ pagoxfac[0].importe2 - pagoxfac[0].total }}</h3></div>
		  	  <div><h3>Importe: ${{ pagoxfac[0].importe2 }}</h3></div>
		  	</v-card-text>
	  	</v-card>
	  </div>
	</v-container>
</template>
<script>
  export default {
    data () {
      return {
      	fecha: new Date().toISOString().substr(0, 10),
      	importe :0,
      	dialog: false,
        idfacturas:'',
        idpagos:'',

        loading: true,
        page: 1,
        pageCount: 0,
        itemsPerPage: 10,
        search: '',
        pagoxfac: [],
        nomclis :[],
        longitud:5,

        expanded: [],
        singleExpand: false,
        headers: [
          { text: '#Pago'              , value: 'idpagoxfac' },
          { text: 'Fecha de pago'      , value: 'fecha' },
          { text: 'Importe'            , value: 'importe' },
          { text: 'Actions'          , value: 'actions' },
        ],
      }
    },

    created () {
      this.idfacturas = this.$route.params.id
      this.idpagos = this.$route.params.idpagos
      this.consultar(this.idfacturas)
    },

    methods:{

      exportar(){
        let xls = {
          data:     this.pagoxfac, 
          tHeaders : ['ID', 'Nombre', 'Nombre Comercial'],
          filterVal: ['idweb', 'nomcli', 'nomcomer'],
          nomfile : "Consulta de pagos"
        }
        // console.log(xls)
         this.exportarXls(xls)
      },
        

      // Consulto todos los pagos
      consultar(idfacturas){
        this.loading = true
        this.$http.get('pagoxfac.list/' + idfacturas).then(response=>{
          this.pagoxfac = response.body
          this.longitud = this.pagoxfac.length
        	// if(this.pagoxfac[0].total >= this.pagoxfac[0].importe2){
        	// 	this.actualizarFactura()
        	// }
        }).catch(error=>{
          console.log(error)
        }).finally(()  => this.loading = false) 
      },

      regresar(){
      	this.$router.push({name:'catfacturas', params: {id: this.idpagos}})
      },

      newFac(){
        this.$router.push({name:'newpagoxfac', params: {id: this.idfacturas}})
      },

      eliminar(idfacturas){
        console.log(idfacturas)

      },

      save(){
      	var payload = {
      		importe: this.importe,
      		fecha: this.fecha,
      		idfacturas: this.idfacturas
      	}
      	this.$http.post('pagoxfac.add' , payload).then(response=>{
          this.consultar(this.idfacturas)
          this.dialog = false
        }).catch(error=>{
          console.log(error)
        }).finally(()  => this.loading = false) 

      },

      actualizarFactura(){
    //   	var payload = {
				// 	idfacturas: this.idfacturas,
				// 	fpago: this.fecha
				// 	estatus: this.switch1
				// }
				// console.log(payload)

				// this.$http.put('v1/facturas.update', payload).then(response=>{
				// 	this.text = 'Factura Actualizada correctamente'
				// 	this.color = 'success'
				// 	this.snackbar=true
				// 	console.log(response.body)
				// 	this.$router.push({name:'catfacturas', params: {id: this.$route.params.id}})
				// }).catch(error=>{
				// 	this.text = 'Factura  NO Actualizada'
				// 	this.color = 'error'
				// 	this.snackbar = true
				// 	console.log(error)
				// })
      }

    },
  }
</script>