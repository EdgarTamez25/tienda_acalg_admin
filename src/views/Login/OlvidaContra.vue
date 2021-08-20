<template>
	<v-layout row wrap justify-center class="pa-4">
	  <v-flex xs12 sm8 md5 lg4>

	  	<v-snackbar
        v-model="snackbar"
        :timeout="8000"
        top
        color="orange" dark
      >
        {{text}}
        <v-btn
          color="white"
          text
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </v-snackbar

	   	<v-card>
        <v-flex xs12>
          <v-toolbar color="primary" dark>
            <v-toolbar-title > Recuperar mi Contraseña </v-toolbar-title>
           	<v-spacer></v-spacer>
              <v-btn  dark color="blue lighten" :to="{name:'Login'}">Cancelar</v-btn>
          </v-toolbar>
        </v-flex>
      </v-card>

      <v-card class="mt-1 pa-3" align="center">
        <div class="logo "  >
          <img :src="logo" width="200" height="80%" class="mb-5" >
        </div>
            <!-- EMAIL -->
        <v-flex xs12>
          <v-text-field
            autofocus
            v-model="email" 
            prepend-icon="email" 
            label="Correo" 
            required
            type="text">
          </v-text-field>
        </v-flex>
        
        <v-divider></v-divider>
				
				<v-card-actions class="mt-1 mx-3">
            <v-spacer></v-spacer>
            <v-btn  color="blue darken-3" dark 
              @click="ValidarCorreo" 
              class="elevation-5">Recordar</v-btn>
              <!-- 
                            <v-btn  color="blue darken-3" dark 
                            @click="Recuperar" 
                            class="elevation-5">Recuperar</v-btn>
                -->
             </v-card-actions>
      </v-card>
	  </v-flex>
	</v-layout>
</template>

<script>
import router from '@/router'
import {mapActions , mapGetters} from 'vuex'
  export default {
    data(){
      return{
        logo:'',

        email:'',
        id   : '',
        Nomuser: '',

        snackbar: false,
        y: 'top',
        x: null,
        mode: '',
        timeout: 8000,
        text: '',


      }
    },

    created(){
      this.$http.get('api/v1/logos.list').then(response=>{
        this.logo = response.body.Logourl

      }, error => {
        console.log(error)
      })
    },

    computed:{
      // ...mapGetters('Login',['getdatosUsuario']),
   },

    
    methods:{

      Recuperar (){
        if(this.email == ''){
          this.snackbar = true ; this.text = "Capture su email"
          return
        }

        const payload= {  Email: this.email }
        console.log (payload) 

        console.log (payload)
        this.$http.post('api/v1/olvidacontra', payload).then(response =>{
          console.log(response) 
          }).catch(error=>{
          console.log(error)       
          }) 

      },


      ValidarCorreo(){
      	if(this.email == ''){
       		this.snackbar = true ; this.text = "Capture su correo electronico"
       		return
      	}

      	const payload= {  Email: this.email }

        console.log(payload)
    		return new Promise((resolve, reject) => {
          
          this.$http.post('api/v1/olvidacontra', payload) .then(respuesta=>{return respuesta.json()})
          
          .then(respuestaJson=>{

            if(respuestaJson === null){
              resolve(false)
              this.snackbar= true ; this.text="Esté correo no es valido." ; this.timeout=3000
            }else{
              console.log('Enviar correo')

              const payload = {
              	Idusuariosweb  : respuestaJson[0].idusuariosweb,
              	Nomuser        : respuestaJson[0].Nomuser,
              	Email          : respuestaJson[0].Email,
                logo   : this.logo,
                color  : this.$vuetify.theme.themes.light.primary,
                ruta   : this.$http.options.root.substr(0,this.$http.options.root.length -6) + "/activarusuario/" + id
              }

              console.log('payload', payload)
              this.Enviarcorreo(payload)
              resolve(true)
            }

            }).catch(function(error){console.log('error',error)})
          })
        	
      },

      Enviarcorreo (payload){
	
				this.$http.post('api/v1/sendolvidacontra',payload).then(function(response){
          console.log('Entre a eviar correo')
	        if(response.status == 200){
            console.log('Se enviara correo')

	        	this.color = 'success'
	        	this.snackbar = true
	        	this.text = 'Se ha enviado el correo de validacion a su cuenta.'
	        	this.to=''
	        	this.subject=''
	        	this.cuerpo=''
	        }else{
            console.log('No Se enviara correo')

	        	this.color = 'red'
	        	this.snackbar = true
	        	this.text = 'Falla al enviar el correo'
	        	this.to=''
	        	this.subject=''
	        	this.cuerpo=''
	        }  

          var me = this
          // Mandar a login
          setTimeout(function(){ me.$router.push({name: 'Login'}) }, 3000);
	      })

	  	},
    }
  };


</script>

<style scoped>
  
  .logo{
    align-content: "center";
    text-align: center;

  }
</style>
