<template>
  <v-container>
    <v-snackbar v-model="snackbar" :timeout="4000" :color="color" top> {{text}}
        <v-btn color="white" text @click="snackbar = false" > Cerrar  </v-btn>
      </v-snackbar>
    
    <v-row justify="center">
      <v-col cols="12" xl="5" lg="5" md="6">
        <v-card  align="center" outlined class="pa-0  elevation-2">
          <v-card-text>
            <v-img :src="url + 'fotos/logo.png'" width="50%"/>
          </v-card-text>
          <v-card  class="pa-5 my-1 transparent elevation-0"> 
            <v-card-subtitle class="font-weight-black headline"> ¡ LISTO ! <br> TU CUENTA  YA ESTA ACTIVADA </v-card-subtitle>
          </v-card>
          <v-btn 
            outlined fab 
            color="green" 
            class="my-1" 
            height="100px" width="100px"
          >
            <v-icon x-large >thumb_up_alt</v-icon>
          </v-btn>
          <v-card-actions>
            <v-btn outlined block color="primary " class="mt-2" :href="urlreturn">Inicia Sesión</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
  export default {
    data () {
      return {
        urlreturn:'',
        snackbar: false,
        id: '',
        logo:'',
        color:'',
        text:''
      }
    },

    created () {
      this.return=''
      console.log(this.$route.params.id)
      this.id = this.$route.params.id
      this.activarcorreo()

      this.url  = this.$http.options.root
      this.urlreturn = this.$http.options.root.substr(0,this.$http.options.root.length -6)
      this.urlreturn = this.urlreturn + '/#/'

    },
     methods:{
      activarcorreo(id){
        var me = this
        
        this.$http.put('users.activar/' + this.id).then(function(response){
          this.text = 'Usuario activado'
          this.color = 'success'
          this.snackbar = true 
        })
      },

     }
  };
</script>

<style scoped>
.contenido{
  padding: 48px;  
}

.titulo{
  font-family: black;
  font-size: 30px;
}

.sait{
  font-family: black;
  font-size: 18px
}

.infoEmpresa{
  font-size: 11px
}
</style>