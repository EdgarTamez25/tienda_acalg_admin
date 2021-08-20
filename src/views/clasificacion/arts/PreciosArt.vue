<template>
	<v-container>
		<v-snackbar
		  v-model="snackbar"
		  :color="color"
		  top
		>
		  {{text}}
		  <v-btn text  @click.native="snackbar = false">Close</v-btn>
		</v-snackbar>
		<v-card class="elevation-0">
			<v-card-title primary-title>
			  Precio del artículo 
			  <v-spacer></v-spacer>
			  <v-btn color="success" @click="update" small>Actualizar</v-btn>
			</v-card-title>
			<v-card-text>
			  <v-row>
			  	<v-col cols="12" xl="3" lg="3" md="4" sm="4" xs="6">
			  		<v-text-field
			  		  label="Precio"
			  		  v-model = "producto.precio1"
			  		  type="number"
			  		  prefix="$"
			  		  suffix="MXN"
			  		></v-text-field>

			  		<v-text-field
			  		  label="Impuesto"
			  		  v-model = "producto.impuesto1"
			  		  type="number"
			  		  prefix="%"
			  		  suffix="MXN"
			  		></v-text-field>

            <v-text-field
              label="% Descuento"
              v-model = "producto.pjedesc"
              type="number"
              prefix="%"
              @change="calcularDescuento()"
            ></v-text-field>

            <v-text-field
              v-if="producto.pjedesc > 0"
              v-model="preciowithdescuento"
              label="Precio con descuento"
              prefix="$"
              suffix="MXN"
            ></v-text-field>

			  	</v-col>
			  </v-row>
			</v-card-text>
		</v-card>
	</v-container>
</template>
<script>
  import {mapGetters, mapActions} from 'vuex'
  export default {
    data () {
      return {
      	producto:[],
      	text:'',
      	snackbar: false,
      	color:'',
        preciowithdescuento: 0,
      }
    },

    created(){
    	console.log(this.getProducto)
    	this.codigo = this.getProducto.codigo
    	this.cargarInfo()
    },

    methods:{

    	cargarInfo(){
        this.$http.get('articulos.codigo/'+ this.codigo).then(response=>{
          console.log(response)
    			this.producto = response.body[0]
    			console.log('articulo',response.data[0])
          if(this.producto.pjedesc > 0){
            this.calcularDescuento()
          }
    		}).catch(error=>{console.log(error)})
    	},
    	
      update(){

        console.log(this.producto)
        this.producto.precio1 = parseFloat(this.producto.precio1)
        this.producto.pjedesc = parseFloat(this.producto.pjedesc)
        this.$http.put('admin/articulos.update/'+ this.producto.id, this.producto).then(response=>{
  				this.text = 'Precios actualizados'
  				this.color = 'success'
  				this.snackbar = true
    			this.cargarInfo()
    		}).catch(error=>{console.log(error)})
      },

      calcularDescuento(){
        this.preciowithdescuento = ((100 - this.producto.pjedesc)/100) * this.producto.precio1
      }

     
    },

    computed: {
      ...mapGetters('productos',['getProducto']),
    }

  }
</script>