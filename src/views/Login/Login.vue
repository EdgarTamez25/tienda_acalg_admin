<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center" class="fill-height">
    
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
      </v-snackbar>

      <v-col cols="12" md="8" lg="6" >
        <v-card class="elevation-0">
          <v-card-text class="mt-2">
            <div class="logo my-3" alt="DevCode" >
              <img src="@/assets/logo.png" width="200" height="80%" class="mb-5" >
            </div>

            <v-form>
              
                <!-- EMAIL -->
              <v-text-field
                autofocus
                v-model="email" 
                prepend-inner-icon="email" 
                label="Correo" 
                required
                outlined
                dense
                type="text">
              </v-text-field>

                <!-- PASSWORD -->
              <v-text-field
                v-model="password"
                prepend-inner-icon="lock"
                :append-icon="show1 ? 'visibility' : 'visibility_off'"
                :rules="[rules.required, rules.min]"
                :type="show1 ? 'text' : 'password'"
                label="contraseña"
                hint="At least 8 characters"
                counter
                @click:append="show1 = !show1"
                outlined
                dense
              ></v-text-field>

              <v-col cols="12" v-if="error">
                <v-card  color="red lighten-1" class=" px-2 py-2">
                  <div class="white--text">
                    {{ error }}
                  </div>
                </v-card>
              </v-col>

            </v-form>
          </v-card-text>
            
              <!-- BOTONES -->
          <v-card-actions class="mt-1 mx-3">
            <v-spacer></v-spacer>
            <v-btn  color="primary"  small dark @click="ingresar" class="elevation-5">Login</v-btn>
          </v-card-actions>
          
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn  
              color="primary darken-3" dark small 
              :to="{name: 'olvidacontra'}">Olvide mi contraseña.
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import router from '@/router'
import {mapActions , mapGetters} from 'vuex'
  export default {
    data(){
      return{
        url:'',
        password: '',
        email:'',

        snackbar: false,
        y: 'top',
        x: null,
        mode: '',
        timeout: 8000,
        text: '',

        show1: false,
        error: '',


        rules: {
          required: value => !!value || 'Requerido.',
          min: v => v.length >= 8 || 'Minimo 8 caracteres',
          emailMatch: () => ('El correo y/o la contraseña no son correctos')
        },

        NombreAsig: '',
        Nomuser: '',
      }
    },

    created(){
      this.url  = this.$http.options.root + 'fotos/logo.png'
      if(this.getLogeado){
        this.$router.push({ name: 'home' })  
      }
    },

    computed:{
      ...mapGetters('Login',['getdatosUsuario','getLogeado']),
    },

    
    methods:{
      ...mapActions('Login',['validarUser']),
      ...mapActions('Login',['GetInfoUser' ,]),


      ingresar (){
        var md5     = require('md5')
        // var payload = { "Username": this.email, "Password": md5(this.password)}
        var usuario = { "email"   : this.email, "password": md5(this.password)}
        // Traemos la información del usuario
        this.GetInfoUser(usuario).then(response => {
          if(response == false){
            this.text  = "Verifica que tus datos esten correctos"
            this.snackbar = true 
            return
          }else if(response == true){
            this.$router.push({ name: 'home' })  
          }else{
            this.text  = response
            this.snackbar = true 
          }
        }).catch(error =>{
          console.log(error)
        })
      }
    }
  };


</script>

<style scoped>
  
  .logo{
    align-content: "center";
    text-align: center;

  }
</style>


  