<template>
  <v-layout row wrap justify-center class="pa-4">
    <v-flex xs12 sm7 md5 lg4>

      <v-snackbar
        v-model="snackbar"
        :timeout="3000"
        top
        :color="color" dark
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
            <v-toolbar-title > Cambiar Contraseña </v-toolbar-title>
            <v-spacer></v-spacer>
              <v-btn  dark color="blue darken-3" :to="{name:'Login'}">Cancelar</v-btn>
          </v-toolbar>
        </v-flex>
      </v-card>

      <v-card class="mt-1 pa-3" align="center">
        <div class="logo "  >
          <img :src="logo" width="200" height="80%" class="mb-5" >
        </div>
            <!-- EMAIL -->
        <v-flex xs12 class="pa-1">
          <v-text-field
            autofocus
            v-model="email" 
            prepend-icon="email" 
            label="Correo" 
            required
            type="text">
          </v-text-field>
        </v-flex>

        <v-flex xs12 class="pa-1">
          <v-text-field
            v-model="password"
            prepend-icon="lock"
            :append-icon="show1 ? 'visibility_off' : 'visibility'"
            :rules="[rules.required, rules.min]"
            :type="show1 ? 'text' : 'password'"
            name="input-10-1"
            label="Ingresa tu nueva contraseña"
            hint="At least 8 characters"
            counter
            @click:append="show1 = !show1"
          ></v-text-field>
        </v-flex>

        <v-flex xs12 class="pa-1">
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

        <v-divider></v-divider>
        
        <v-card-actions class="mt-1 mx-3">
            <v-spacer></v-spacer>
            <v-btn  color="blue darken-3" dark @click="cambiarContra" class="elevation-5"> Procesar </v-btn>
          </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    data () {
      return {
        logo:'',

        id: '',
        EmailOrg: '',
        
        password:'',
        password2:'',

        email:'',

        snackbar: false,
        text: '',
        color: '',

        show1: true,
        show2: true,
        isPaste: false,
        drawer: null,
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


    created () {
      this.$http.get('api/v1/logos.list').then(response=>{
        this.logo = response.body.Logourl

      }, error => {
        console.log(error)
      })
      console.log('parametro que recibo',this.$route.params.id)
      this.id = this.$route.params.id

      // MANDO A TRAER LOS DATOS DEL USUARIO "ID"
      this.DatosUser()  
    },

    computed:{
    // ...mapGetters('', ['']),
    validaInfo(){
    return  this.email        !==  '' &&
            this.password     !==  '' &&
            this.password2    !==  ''  
    },

    validaPassword(){
      return this.password.localeCompare(this.password2)        
    }
  },


   methods:{

    DatosUser(){
      const payload = { Idusuariosweb : this.id }

      this.$http.post('api/v1/getuserxid', payload).then(function(response){
        this.EmailOrg = response.body.Email
      }).catch(function(error){
        console.log(error)
      })

    },

    cambiarContra(){
      this.snackbar = false 
      var me = this

      if(!this.validaInfo){
        this.text     = "Faltan campos por agregar"; this.snackbar = true
        this.color    = "orange"; this.timeout = 3000;
        return
      }

      if(this.validaPassword != 0){
        this.text     = "Las contraseñas no coinciden" ; this.snackbar = true
        this.color    = "orange" ; this.timeout = 3000;
        return
      }

      if(this.EmailOrg != this.email){
        this.text     = "El email no coincide con el número de usuario" ; this.snackbar = true
        this.color    = "red" ; this.timeout = 3000;
        return
      }

      this.error = null;
      var md5 = require('md5');

      var payload = { password : md5(this.password),}

      return new Promise((resolve, reject) => {
        
        this.$http.put('api/v1/cambiarcontra/'+ this.id, payload).then(respuesta=>{return respuesta.json()})
        
        .then(respuestaJson=>{

          if(respuestaJson === null){
            this.snackbar= true ; this.text="Lo sentimos no se logro cambiar la contraseña." 
            this.color    = "orange";
          }else{
            this.snackbar= true ; this.text="La contraseña se ha actualizado correctamente." 
            this.color    = "green";

            setTimeout(function(){ me.$router.push({name: 'Login'}) }, 3000);
          }

          }).catch(function(error){console.log('error',error)})
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