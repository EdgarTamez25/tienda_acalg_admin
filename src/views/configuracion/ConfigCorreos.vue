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
        <v-alert type="info" :value="true" text border="right" color="info">
        	Aquí podrás agregar los correos de las personas a las que quieras que les llegue una copia de nuevas cotizaciones
        </v-alert>
      </v-col>
      <v-col cols="12" xl="6" lg="6" md="6" sm="12" xs="12">
        <v-card-title primary-title>
          Correo 1
        </v-card-title>
      	<v-card-text>
	       	<v-text-field
	       	  outlined
	       	  label="Correo"
	       	  v-model="ciaws.email1"
	       	  append-icon="email"
            :rules="emailRules"
	       	></v-text-field>
    			<v-btn color="primary" @click="validaInfo">Actualizar</v-btn>
      	</v-card-text>
      </v-col>
      <v-col cols="12" xl="6" lg="6" md="6" sm="12" xs="12">
        <v-card-title primary-title>
          Correo 2
        </v-card-title>
        <v-card-text>
          <v-text-field
            outlined
            label="Correo"
            v-model="ciaws.email2"
            append-icon="email"
            :rules="emailRules"
          ></v-text-field>
        </v-card-text>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
	import {mapGetters, mapActions} from 'vuex'
  export default {
    data: () => ({
      snackbar:false,
      text:'',
      color:'',

      ciaws: {},

      emailRules: [
          v => !!v || '*Requerido',
          v => /.+@.+\..+/.test(v) || 'email no valido',
        ],
    }),

    created(){
    	this.init()
    },

    computed:{

    },

    methods:{
      init(){
        this.$http.get('config.list').then(response=>{
          this.ciaws = response.body
        })
      },

      validaInfo(){
        if(this.ciaws.email1 == '' && this.ciaws.email2 == ''){
          this.text = 'No puedes agregar campos vacios'
          this.snackbar = true
          this.color = 'warning'
          return
        }

        if(this.ciaws.email1.length > 50 || this.ciaws.email2.length > 50){
          this.text = 'El campo exede el limite de acracteres (50)'
          this.snackbar = true
          this.color = 'warning'
          return
        }

        this.agregar()


      },

    	agregar(){
        
    		this.$http.put('config.update', this.ciaws).then(response=>{
          this.text = 'Actualizado correctamente'
          this.snackbar = true
          this.color = 'success'
          this.init()
        })
    	},



    }

  }
</script>