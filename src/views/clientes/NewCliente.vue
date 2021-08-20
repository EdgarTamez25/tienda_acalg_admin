<template>  
  <v-container>
    <v-row > 
      <v-col cols="12" xl="6" lg="6" md="8" sm="8">
        <v-card>
          <v-card-title primary-title>
            {{modoText}}
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
                :readonly="readonly"
                v-model="usuario.nomuser"
                :counter="15"
                label="Nombre de usuario"
              ></v-text-field>

              <v-text-field
                :readonly="readonly"
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

              <v-text-field
                v-if="nModo == 1"
                v-model="usuario.password"
                prepend-icon="lock"
                :append-icon="show1 ? 'visibility' : 'visibility_off'"
                :type="show1 ? 'text' : 'password'"
                label="contraseña"
                hint="Máximo 30 caracteres"
                :counter="30"
                required
                @click:append="show1 = !show1"
              ></v-text-field>
              <v-radio-group v-model="usuario.estatus" row v-if="nModo == 2">
                <v-radio label="Inactivo" :value="0"></v-radio>
                <v-radio label="Activo" :value="2"></v-radio>
                <v-radio label="Baja" :value="3"></v-radio>
              </v-radio-group>


              <v-btn
                v-if="nModo == 1"
                :disabled="!valid"
                color="success"
                class="mr-4"
                @click="validar"
              >
                Agregar
              </v-btn>

              <v-btn
                v-if="nModo == 2"
                :disabled="!valid"
                color="success"
                class="mr-4"
                @click="update"
              >
                Actualizar
              </v-btn>

              <v-btn
                color="error"
                class="mr-4"
                @click="reset"
              >
                Limpiar campos
              </v-btn>

              <v-btn
                color="blue lighten-2" 
                :to="{name:'catusuarios'}" 
                dark>Atras
              </v-btn>

            </v-form>
          </v-card-text>

        </v-card>
      </v-col>
      <!-- SNACK BAR -->
      <v-snackbar
        v-model="snackbar"
        :timeout="8000"
        top
        :color="color" 
        dark
        >
        {{text}}
          <v-btn
            color="white"
            text
            @click="snackbar = false"
          >
            Cerrar
          </v-btn>
      </v-snackbar>
    </v-row>
  </v-container>
</template>


<script>

  import {mapActions , mapGetters} from 'vuex'

  var accounting = require("accounting");
  var md5     = require('md5')

  export default {
    
    data () {
      return {
        idusuariosweb:'',
        nModo:'',
        modoText:'',
        usuario:[],

        readonly: false,

        niveles: ['ADMIN','USUARIO','ALMACEN'],
        nivel:'',

        snackbar: false,  
        error: '',
        color:'',
        text:'', 

        show1: false,


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

      }
    },

    created () {
      this.idusuariosweb = this.$route.params.idusuariosweb
        // console.log(this.id)
      if (this.idusuariosweb !== undefined){
        this.nModo = 2
        // console.log("es LA CATEEGO :",this.idCatego)
        this.cargarinfo(this.idusuariosweb) 
        this.readonly = true    
      } else {
        this.nModo = 1
      }     

      this.nModo == 1 ? (this.modoText = 'Nuevo Usuario'):(this.modoText = 'Editar usuario')
    },

    methods:{
      ...mapActions('Login',['validarUser']),
      ...mapActions('Login',['GetInfoUser' ,]),
      // CARGAR INFO 
      cargarinfo(id){
        this.$http.get('users/' + id).then(response => { 
        // response.body.statusweb = !!response.body.statusweb
          this.usuario = response.body
          //cargar los clientes
          console.log(this.usuario)
        }).catch(error=>{
            console.log(error)
        })

      },

      validar(){
        if (this.nModo == 1) {
          this.validarExistencia()
        }  else {
          var me = this 
          this.$http.put('auth/api/v1/usuarios.update/'+ this.usuario.idusuariosweb, payload).then(response => {
            // console.log('response', response.body)
            this.snackbar = true ; this.color="blue lighten-3"
            this.text = "El usuario de modifico correctamente."
            setTimeout(function(){ me.$router.push({name: 'catusuarios'}) }, 2000);
          }).catch(error=>{
            console.log(error)
          })

        }
      },

      validarExistencia(){
        var payload = {
          nomuser  : this.usuario.nomuser,
          nomper   : this.usuario.nomper,
          email    : this.usuario.email,
          password : md5(this.usuario.password),
          nivel    : this.usuario.nivel,
          estatus  : 0
        }

        this.$http.post('user.email', payload).then(respuesta=>{
          console.log('respuesta getId',respuesta)
          if(respuesta.body.message){
            this.newUsuario(payload)
          }else{
            console.log('no agregar')
            if(respuesta.body.email == this.usuario.email){
              this.text = 'El correo que quieres registrar ya existe'
              this.color = 'red'
              this.snackbar = true
            }

            if(respuesta.body.nomuser == this.usuario.nomuser){
              this.text = 'El correo que quieres registrar ya existe'
              this.color = 'red'
              this.snackbar = true
            }
          }
        })
      },

      newUsuario(payload){
        this.$http.post('user.add', payload).then( response => {
          this.enviarCorreo(response.body.id)
          this.snackbar = true
          this.color = "blue lighten-3"
          this.text = "El usuario se guardo correctamente."
        }).catch(error => {
          console.log(error.body)
        })
      },

      enviarCorreo(id){
        var url = 'https://surtimedix.com/admin-app/#/activarusuario/'

        var payload = {
          nomper:       this.usuario.nomper,
          correo:       this.usuario.email,
          url:          url + id
        }

        this.$http.post('correos.send',  payload).then(respuesta=>{ 
          console.log(respuesta)
          this.text = 'Se envío un correo de validación'
          this.color = 'success'
          this.snackbar = true
        }).catch(error=>{
          console.log('error',error)
          resolve(false)
        })
      },

      update(){
        console.log(this.usuario)

        this.$http.put('updateuser/' + this.usuario.idusuariosweb, this.usuario).then( response => {
          this.snackbar = true
          this.color = "blue lighten-3"
          this.text = "El usuario se actualizo correctamente."
          this.cargarinfo(this.usuario.idusuariosweb)
        }).catch(error => {
          console.log(error.body)
        })
      },



      reset () {
        this.$refs.form.reset()
      },

    }
  };
</script>




