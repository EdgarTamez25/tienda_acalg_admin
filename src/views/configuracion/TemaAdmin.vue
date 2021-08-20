<template>
  <v-container >
  	<v-snackbar
      v-model="snackbar"
      :timeout="4000"
      top
      :color="color"
    >
      {{text}}
      <v-btn
	      text
	      dark
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
    <v-row>
      <v-col cols="12">
        <v-row>
		      <v-col cols="12" xl="3"  lg="4" md="3" sm="4" xs="12">
		      	<v-card>
		      	  <v-card-title primary-title>
		      	    <v-btn class="ml-1"   dark :color="primario" >   Principal   </v-btn>
		      	  </v-card-title>
		      	  <v-card-text align="center">
      					<v-color-picker v-model="primario"  hide-inputs ></v-color-picker>
		      	  </v-card-text>
		      	</v-card>
		      </v-col>
		      <v-col cols="12" xl="3"  lg="4" md="3" sm="4" xs="12">
		      	<v-card>
		      	  <v-card-title primary-title>
		      	     <v-btn class="ml-1"  dark :color="secundario">  Secundario  </v-btn>
		      	  </v-card-title>
		      	  <v-card-text align="center">
      					<v-color-picker v-model="secundario" hide-inputs></v-color-picker>
		      	  </v-card-text>
		      	</v-card>
		      </v-col>
		      <v-col cols="12" xl="3"  lg="4" md="3" sm="4" xs="12">
		      	<v-card>
		      	  <v-card-title primary-title>
		      	     <v-btn class="ml-1"  dark :color="correcto">    Completado  </v-btn>
		      	  </v-card-title>
		      	  <v-card-text align="center">
      					<v-color-picker v-model="correcto" hide-inputs></v-color-picker>
		      	  </v-card-text>
		      	</v-card>
		      </v-col>
		      <v-col cols="12" xl="3"  lg="4" md="3" sm="4" xs="12">
		      	<v-card>
		      	  <v-card-title primary-title>
		      	     <v-btn class="ml-1"  dark :color="informatico">       Informativo </v-btn>
		      	  </v-card-title>
		      	  <v-card-text align="center">
      					<v-color-picker v-model="informatico" hide-inputs></v-color-picker>
		      	  </v-card-text>
		      	</v-card>
		      </v-col>
		      <v-col cols="12" xl="3"  lg="4" md="3" sm="4" xs="12">
		      	<v-card>
		      	  <v-card-title primary-title>
		      	     <v-btn class="ml-1"  dark :color="errores">      Error       </v-btn>
		      	  </v-card-title>
		      	  <v-card-text align="center">
      					<v-color-picker v-model="errores" hide-inputs></v-color-picker>
		      	  </v-card-text>
		      	</v-card>
		      </v-col>
		      <v-col cols="12" xl="3"  lg="4" md="3" sm="4" xs="12">
		      	<v-card>
		      	  <v-card-title primary-title>
		      	     <v-btn class="ml-1"  dark :color="peligro">    Advertencia </v-btn>
		      	  </v-card-title>
		      	  <v-card-text align="center">
      					<v-color-picker v-model="peligro" hide-inputs></v-color-picker>
		      	  </v-card-text>
		      	</v-card>
		      </v-col>
		      <v-col cols="12" xl="3"  lg="4" md="3" sm="4" xs="12">
		      	<v-card class="elevation-0">
		      	  <v-card-actions>
		      	    <v-btn color="primary" @click="update">Actualizar</v-btn>
		      	  </v-card-actions>
		      	</v-card>
		      </v-col>
		    </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
  export default {
    data: () => ({
      primario:'#000000',
      secundario:'#000000',
      correcto:'#000000',
      informatico:'#000000',
      errores:'#000000',
      peligro:'#000000',
      snackbar:false,
      text:'',
      color:'',
    }),

    created(){
    	this.init()

    },

    methods:{
    	init(){
    		this.$http.get('config.list').then(response=>{
	    		this.ciaws = response.body
	    		this.primario =     this.ciaws.primario
	        this.secundario =   this.ciaws.secundario
	        this.correcto =     this.ciaws.correcto
	        this.informatico =  this.ciaws.informatico
	        this.errores =      this.ciaws.errores
	        this.peligro =      this.ciaws.peligro
	    	}).catch(error=>{console.log(error)})
    	},

    	vueColor(){
    		this.$vuetify.theme.themes.light.primary = this.ciaws.primario
    		this.$vuetify.theme.themes.light.secondary = this.ciaws.secundario
    		this.$vuetify.theme.themes.light.success = this.ciaws.correcto
    		this.$vuetify.theme.themes.light.info = this.ciaws.informatico
    		this.$vuetify.theme.themes.light.error = this.ciaws.errores
    		this.$vuetify.theme.themes.light.warning = this.ciaws.peligro
    	},


    	update(){
    		this.ciaws.primario  = this.primario
        this.ciaws.secundario  = this.secundario
        this.ciaws.correcto  = this.correcto
        this.ciaws.informatico  = this.informatico
        this.ciaws.errores  = this.errores
        this.ciaws.peligro  = this.peligro

    		this.$http.put('config.update', this.ciaws).then(response=>{
					this.text = 'Datos actualizados correctamente'
					this.color = 'success'
					this.snackbar = true
					this.init()
					this.vueColor()
				}).catch(error=>{console.log(error)})

    	}
    }

  }
</script>