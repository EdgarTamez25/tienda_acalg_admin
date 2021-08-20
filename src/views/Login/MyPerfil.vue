<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title primary-title>
            Mi Perfil
          </v-card-title>
          <v-card-text>
            <v-form
              ref="form"
              v-model="valid"
              :lazy-validation="lazy"
            >
              <v-text-field
                v-model="usuario.nomper"
                :counter="50"
                :rules="nameRules"
                label="Nombre"
                required
              ></v-text-field>

              <v-text-field
                v-model="usuario.nomuser"
                :counter="15"
                label="Nombre de usuario"
              ></v-text-field>

              <v-text-field
                v-model="usuario.email"
                :rules="emailRules"
                label="E-mail"
                required
              ></v-text-field>

              <v-select
                v-model="usuario.nivel"
                :items="niveles"
                :rules="[v => !!v || '*Requerido']"
                label="Nivel"
                required
              ></v-select>

              <v-btn
                :disabled="!valid"
                color="success"
                class="mr-4"
                @click="update"
              >
                Actualizar
              </v-btn>

              <v-btn
                color="secondary"
                class="mr-4"
                @click="cambiarContra"
              >
                Actualizar Contraseñas
              </v-btn>

            </v-form>
          </v-card-text>

          <v-card-text v-if="contra == true">
            <v-text-field
              v-model="password1"
              prepend-icon="lock"
              :append-icon="show1 ? 'visibility' : 'visibility_off'"
              :type="show1 ? 'text' : 'password'"
              label="contraseña actual"
              hint="Máximo 30 caracteres"
              :counter="30"
              required
              @click:append="show1 = !show1"
            ></v-text-field>

            <v-text-field
              v-model="password2"
              prepend-icon="lock"
              :append-icon="show ? 'visibility' : 'visibility_off'"
              :type="show ? 'text' : 'password'"
              label="Nueva contraseña"
              hint="Máximo 30 caracteres"
              :counter="30"
              required
              @click:append="show = !show"
            ></v-text-field>
          </v-card-text>
          <v-card-actions v-if="contra == true">
            <v-btn
              :disabled="!valid"
              color="success"
              class="mr-4"
              @click="compararContra"
            >
              Actualizar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar
      v-model="snackbar"
      :timeout="4000"
      top
      :color="color"
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
  </v-container>
 <!--  <v-layout row wrap align-center justify-center>
    <v-flex xs12 sm6  class="pa-2">
      
      <v-snackbar
          v-model="snackbar"
          :timeout="4000"
          top
          :color="color"
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

  

      <v-card class="elevation-12">
        <v-card-text >
          <v-form class="pa-3">
            <v-layout row wrap justify-space-between  align-center justify-center>
              <v-flex xs12>
                <v-layout  align-center justify-center row >
                  <img src="logo.png" alt="alt" width="200" height="80%" class="my-4">
                </v-layout>
              </v-flex>    
              
              <v-divider class="mx-5 "></v-divider>

              <v-flex xs12 class="mt-1  pa-0">
                <v-text-field
                  :disabled="disabled"
                  prepend-icon="person"
                  v-model="getdatosUsuario.Nomuser"
                  label="Nombre"
                ></v-text-field>
              </v-flex>

              <v-flex xs12 md6 lg6 class="pa-0">
                <v-text-field
                  :disabled="disabled"
                  prepend-icon="email"
                  v-model="getdatosUsuario.Email"
                  label="Correo"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 md6 lg6 class="pa-0">
                <v-text-field
                  :disabled="disabled"
                  prepend-icon="local_phone"
                  v-model="getdatosUsuario.Telefono"
                  label="Teléfono"
                ></v-text-field>
              </v-flex>

              <v-flex xs12 md6 lg6 class="pr-1 pa-0">
                <v-text-field
                  :disabled="disabled"
                  prepend-icon="work"
                  v-model="getdatosUsuario.Depto"
                  label="Departamento"
                ></v-text-field>
              </v-flex>
            
              <v-flex xs12 class="pa-0" v-if="cambia == true ">
               <v-btn rounded color= "primary" dark :disabled="disabled" @click="CambiarPassword" >Cambiar Contraseña</v-btn>
              </v-flex>

              <v-flex xs12 class="pa-0" v-else >
               <v-btn  rounded color= "red" dark  @click="CambiarPassword">Cancelar</v-btn>
              </v-flex>
          
              <v-flex xs12 md6 lg6 class="mt-1 pa-0" v-if="cambia == false  ">
                <v-text-field
                  v-model="password"
                  prepend-icon="lock"
                  :append-icon="show1 ? 'visibility_off' : 'visibility'"
                  :rules="[rules.required, rules.min]"
                  :type="show1 ? 'text' : 'password'"
                  name="input-10-1"
                  label="Contraseña"
                  hint="At least 8 characters"
                  counter
                  @click:append="show1 = !show1"
                ></v-text-field>
              </v-flex>

              <v-flex xs12 md6 lg6 class="mt-1 pa-0" v-if="cambia == false">
                <v-text-field
                  v-model="password2"
                  prepend-icon="lock"
                  :append-icon="show2 ? 'visibility_off' : 'visibility'"
                  :rules="[rules.required, rules.min]"
                  :type="show2 ? 'text' : 'password'"
                  name="input-10-1"
                  label=" Confirmar Contraseña"
                  hint="At least 8 characters"
                  counter
                  @click:append="show2 = !show2"
                ></v-text-field>
                  
              </v-flex>

            </v-layout>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-if="editar" block color="primary" @click="habilitar"> Editar<v-icon right>edit</v-icon></v-btn>
          <v-btn v-else block color="success" @click="validaInfo"> Guardar<v-icon right>send</v-icon></v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout> -->
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  var md5     = require('md5')

  export default{
    data(){
      return{

        usuario: {},
        lazy: false,
        niveles: ['ADMIN', 'USUARIO', 'ALMACEN'],

        valid: true,
        name: '',
        nameRules: [
          v => !!v || '*Requerido',
          v => (v && v.length <= 50) || 'Máximo 50 caracteres',
        ],
        emailRules: [
          v => !!v || '*Requerido',
          v => /.+@.+\..+/.test(v) || 'email no valido',
        ],
        lazy: false,

        contra: false,


        perfilUser: '',
        editar: true,
        disabled: true,
        snackbar: false,
        text:    '',
        color:   '',

        // VARIABLES PARA CONTRASEÑA
        password1:'',
        password2:'',

        // VER PASSWORD
        show: true,
        show1: true,

        rules: {
          required: value => !!value || 'Requerido.',
          min: v => v.length >= 5 || 'Minimo 5 caracteres',
          emailMatch: () => ('El correo y/o la contraseña no son correctos')
        }
      }
    },

    created () {
      console.log('getdatosUsuario',this.getdatosUsuario) 
      this.cargarInfo(this.getdatosUsuario.idusuariosweb)
    },

    methods:{
      cargarInfo(id){
        this.$http.get('users/' + id).then(response => { 
          this.usuario = response.body
        }).catch(error=>{
            console.log(error)
        })
      },

      cambiarContra(){
        this.contra = true
      },

      compararContra(){
        if(md5(this.password1) == this.usuario.password){
          this.usuario.password = md5(this.password2)
          this.update()
        }
      },

      update(){
        var id =  this.getdatosUsuario.idusuariosweb
        this.$http.put('updateuser/'+ id, this.usuario).then(response=>{
          this.snackbar = true 
          this.text ="Los datos han sido actualizados "
          this.color ="green"
          this.password1 = ''
          this.password2 = ''
          this.contra = false
          this.cargarInfo(id)
        }).catch(error=>{console.log(error)})
      }

    },
    computed:{
      ...mapGetters('Login',['getdatosUsuario', 'getLogeado']),

    },

  };
</script>