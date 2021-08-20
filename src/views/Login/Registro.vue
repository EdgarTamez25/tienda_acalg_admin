<template>
 <v-layout row wrap justify-center class="pa-4">
    <v-flex xs12 sm8 md7 lg6 class="my-5">
       
     <v-snackbar
      v-model="snackbar"
      :timeout="8000"
      top
      color="blue" 
      >
      {{text}}
      <v-btn
        color="white"
        text
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>

      <v-card class="elevation-8">
        <v-flex xs12>
          <v-toolbar color="primary" dark>
            <v-toolbar-title > Registrarse </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn  text color="white" dark :to="{name: 'Login'}"><v-icon>reply</v-icon></v-btn>

          </v-toolbar>
        </v-flex>
      </v-card>
   
      <v-card class="elevation-8 mt-1 pa-1">
        <v-form> 
          <v-layout row wrap  class="mx-4">
            <!-- NOMBRE -->
            <v-flex xs12 >
              <v-text-field v-model="nomuser" prepend-icon="person" name="login" label="Nombre " type="text"></v-text-field>
            </v-flex>
            <v-flex xs12>
              <!-- EMAIL -->
              <v-text-field v-model="email" prepend-icon="email" name="login" label="Email" type="text"></v-text-field>
            </v-flex>
         
            <v-flex xs12 md6 lg6>
              <v-text-field
                v-model="password"
                prepend-icon="lock"
                :append-icon="show1 ? 'visibility_off' : 'visibility'"
                :rules="[rules.required, rules.min]"
                :type="show1 ? 'text' : 'password'"
                name="input-10-1"
                label="Ingresa tu contraseña"
                hint="At least 8 characters"
                counter
                @click:append="show1 = !show1"
              ></v-text-field>
            </v-flex>

            <v-flex xs12 md6 lg6>
              <v-text-field
                v-model="password2"
                prepend-icon="lock"
                :append-icon="show2 ? 'visibility_off' : 'visibility'"
                :rules="[rules.required, rules.min]"
                :type="show2 ? 'text' : 'password'"
                name="input-10-1"
                label="Confirma la contraseña"
                hint="At least 8 characters"
                counter
                @click:append="show2 = !show2"
              ></v-text-field>
            
            </v-flex>
            
            <v-flex xs12>
              <v-card v-if="error" color="red lighten-1" class=" px-2 py-2">
                <div class="white--text">
                  {{ error }}
                </div>
              </v-card>
            </v-flex>
           
          </v-layout>

          <v-divider class="mx-5 mt-3"></v-divider>
          
          <v-layout row wrap >
            
            <v-flex xs12 class="mt-2 pa-4" text-right>
              <v-btn align=" right"color="blue darken-3" dark @click="agregar">Registrase</v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
// import axios from 'axios'
import {mapActions} from 'vuex'

export default {
  data(){
    return{
      // PASSWORD
      show1: true,
      show2: true,
      password:'',
      password2:'',
      rules: {
        required: value => !!value || 'Requerido.',
        min: v => v.length >= 8 || 'Minimo 8 caracteres',
        emailMatch: () => ('El correo y/o la contraseña no son correctos')
      },
      // VARIABLES
      nomuser:'',
      email:'',

      error:'',
      ID: '',
      
      // SNACKBAR
      snackbar: false,
      timeout: 0,
      color : '',
      text:'',
      y: 'top',
      x: null,
      mode: '',

      logo:'',
       
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
    // ...mapGetters('', ['']),
    validaInfo(){
    return  this.nomuser      !==  '' &&       
            this.email        !==  '' &&
            this.password     !==  '' &&
            this.password2    !==  ''  
    },

    validaPassword(){
      return this.password.localeCompare(this.password2)        
    }
  },

  methods:{
        //Importar acciones del moudlo de ordenes
    ...mapActions('Registro',['buscarUsuarioWeb', 'registrarUsuario']), 
    
    agregar(){

      this.snackbar = false 
   
      if(!this.validaInfo){
        this.text     = "Faltan campos por agregar"; this.snackbar = true
        this.color    = "orange"; this.timeout = 3000;
        return
      }

      if(this.validaPassword != 0){
        this.text     = "Las contraseñas no coinciden" ; this.snackbar = true
        this.color    = "#C51162" ; this.timeout = 3000;
        return
      }

      this.error=null;
      var md5 = require('md5');

      var usuario = {
        nomuser:  this.nomuser, 
        email:    this.email, 
        password: md5(this.password),
      }

      this.buscarUsuarioWeb(usuario).then(response => {
        
        // SI LA CONSULTA ME REGRESA FALSO MUESTRO AVISO 
        if (response == false) {

          this.text     = "El correo"+"   "+ this.email + "   "+" ya esta registrado"; this.timeout = 3000;
          this.snackbar = true ; this.color= "blue"

        }else{
          // SI REGRESA TRUE MANDO A REGISTRAR
          this.registrarUsuario(usuario).then(response => {

            // SI EL REGISTRO REGRESA FALSE MUESTRO MENSAJE
            if( response == false){
                this.text     = "Lo sentimos no se pudo insertar."; this.timeout = 3000;
                this.snackbar = true ; this.color= "blue"

            }else{
              // SI REGRESA TRUE MANDO A BUSCAR ID
              this.getId()
            }
          })
        }

      })

    },

    getId(){

      const formData = {
        Email: this.email
      }

      return new Promise((resolve, reject) => {
        
        this.$http.post('api/v1/getidxmail', formData) .then(respuesta=>{return respuesta.json()})
        
        .then(respuestaJson=>{
            console.log('respuesta getId',respuestaJson)
          
          if(respuestaJson === null){
            resolve(false)
            this.snackbar= true ; this.text="No encontre ID" ; this.timeout=3000
          }else{
            console.log('Enviar correo')
            this.ID = respuestaJson.idusuariosweb
            this.enviarCorreo(this.ID)
            // dispatch('enviarCorreo' ,this.ID)
            resolve(true)
          }

          }).catch(function(error){console.log('error',error)})
        })
    },

    enviarCorreo(item){
      var me = this
      var id = item 
      
      // console.log('id', id)

      // const  formData = { to: this.email, idusuariosweb: id }
      const  formData = { 
        Email     : this.email, 
        logo   : this.logo,
        color  : this.$vuetify.theme.themes.light.primary,
        ruta   : "https://redleaf.pro/admin-app/activarusuario/" + id
      }

      console.log('formData to, idusuariosweb', formData )

      this.$http.post('api/v1/activarcuenta', formData).then(function(response){
        if(response.status == 200){
         
          this.text     = "Se ha enviado el código de validación a su correo." 
          this.timeout = 10000;
          this.snackbar = true ; 
          this.color= "#2E7D32"

          // limpiar campos
          this.nomuser = ''
          this.email   = ''
          this.password = ''
          this.password2 = ''

        setTimeout(function(){ me.$router.push({name: 'Login'}) }, 3000);

        }else{

          this.text = 'Falla al enviar el correo'
          this.timeout = 8000
          this.snackbar = true
          this.color = 'red'

        }
      })
    },
    
  }
}
</script>