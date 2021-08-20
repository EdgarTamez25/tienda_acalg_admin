<template>
  <v-container>
    <v-snackbar
      v-model="snackbar"
      :color="color"
      top
    >
      {{text}}
      <v-btn text dark @click.native="snackbar = false">Close</v-btn>
    </v-snackbar>

    <v-stepper v-model="e1" alt-labels>
      <!-- titulos de los steper -->
      <v-stepper-header>
        <v-stepper-step :complete="e1 > 1" step="1" @click="e1=1" >Seleccionar Promo</v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="e1 > 2" step="2" @click="e1=2">Seleccionar correos</v-stepper-step>
      </v-stepper-header>
      
      <!-- Tarjetas -->
      <v-stepper-items>
        <!-- Steper uno  -->
        <v-stepper-content step="1">
          <v-row row wrap>
            <v-card width="100%" height="100%">
              <v-card-title primary-title>
                Selecciona los artículos
                <v-spacer></v-spacer>
              </v-card-title>
              <v-card-text>
                <v-data-table
                  :loading="loading"        
                  :headers="headers"
                  :items="articulos"
                  class="elevation-1"
                  fixed-header
                  height="350"
                  hide-default-footer
                  loading-text="Cargando..."
                  dense
                  :search="search"
                  :items-per-page="longitud"
                  :mobile-breakpoint="250"
                  v-model="selected"
                  item-key="codigo"
                  show-select
                  >
                  <!-- STATUSWEB -->
                  <template v-slot:no-data>
                    <v-alert type="info" color="primary" outlined :value="true">
                      No hay datos para mostrar
                    </v-alert>
                  </template>
                </v-data-table>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="e1 = 2"> Continuar </v-btn>
              </v-card-actions>
            </v-card>
          </v-row>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-row row wrap>
            <v-card width="100%" height="100%">
              <v-card-title primary-title>
                Selecciona los artículos
                <v-spacer></v-spacer>
                <v-btn color="success" @click="enviarPromo">Envíar promo</v-btn>
              </v-card-title>
              <v-card-text>
                <v-data-table
                  :loading="loading"        
                  :headers="headersUsuarios"
                  :items="usuarios"
                  class="elevation-1"
                  fixed-header
                  height="350"
                  hide-default-footer
                  loading-text="Cargando..."
                  dense
                  :search="search"
                  :items-per-page="longitud"
                  :mobile-breakpoint="250"
                  v-model="selectedUsuario"
                  item-key="idusuariosweb"
                  show-select
                  >
                  <!-- STATUSWEB -->
                  <template v-slot:no-data>
                    <v-alert type="info" color="primary" outlined :value="true">
                      No hay datos para mostrar
                    </v-alert>
                  </template>
                </v-data-table>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="e1 = 2"> Continuar </v-btn>
              </v-card-actions>
            </v-card>
          </v-row>
          <v-card-actions>
            <v-btn color="primary" @click="e1 = 1"> Regresar </v-btn>
          </v-card-actions>
        </v-stepper-content>


      </v-stepper-items>
    </v-stepper>

  </v-container>
</template>


<script>
  var numeral  = require('numeral') 

  export default {

    data: () => ({
      // stepers
      e1: 1,
      steps: 2,


      selected:[],
      text:'',
      snackbar:false,
      color:'',


      loading: true,
      longitud:5,
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      search:'',
      articulos:[],
      headers: [
        { text: 'Nombre', align: 'left',sortable: false, value: 'nomart'},
        { text: 'Sal', value: 'sal' },
        { text: 'Laboratorio', value: 'nomlab' },
        { text: 'Precio', value: 'precio1' },
        { text: 'Precio con descuento', value: 'preciodesc' },

      ],

      usuarios:[],
      selectedUsuario:[],
      headersUsuarios: [
        { text: 'ID', align: 'left',sortable: false, value: 'idusuariosweb' },
        { text: 'Nombre'  , value: 'nomper' },
        { text: 'Usuario'  , value: 'nomuser' },
        { text: 'Email'    , value: 'email' },
        { text: 'Nivel', value: 'nivel'},  
        { text: 'Estatus', value: 'estatus'},  
      ],

      url:'',

    }),

    watch:{
      selected(){
        console.log(this.selected)
      },
      steps (val) {
        if (this.e1 > val) {
          this.e1 = val
        }
      },
    },

    created(){
      this.url = this.$http.options.root + 'fotos/'
      this.init()
    },

    methods:{

      init(){
        this.$http.get('tienda/articulos.promociones.get').then(response=>{
          this.articulos = response.body
          this.longitud = this.articulos.length
          this.articulos.forEach((element, index)=>{
            this.loading = false
            element.precio1 = numeral(element.precio1).format('0,0.00')
            element.preciodesc = element.precio1 * ( 100 / (100 + element.pjedesc))
            element.preciodesc = numeral(element.preciodesc).format('0,0.00')
            element.img = this.url + element.fotos[0].image_name
            element.color = this.$vuetify.theme.themes.light.primary
            element.link = this.$http.options.root.replace(':3001','') + '#/detart/' + element.codigo
          })
          // calular la cantidad de páginas
        }).catch(error=>{console.log(error)})

        this.$http.get('users').then( response => {
          response.body.forEach(element=>{
            if(element.nivel == 'USUARIO' && element.estatus == 2){
              this.usuarios.push(element)
            }
          })

        }).catch(error => {
          console.log(error)
        }).finally(()  => this.loading = false) 
      },

      enviarPromo(){
        var articulos = []
        for (var i = this.selected.length - 1; i >= 0; i--) {
          articulos.push({ 
            img        :this.selected[i].img,
            nomart     :this.selected[i].nomart,
            precio     :this.selected[i].precio1,
            link       :this.selected[i].link,
            preciodesc :this.selected[i].preciodesc,
            color      :this.selected[i].color
          })
        }

        var payload = {
          color:this.$vuetify.theme.themes.light.primary,
          color2: this.$vuetify.theme.themes.light.secondary,
          correos: this.selectedUsuario,
          articulos: articulos,
          link: this.$http.options.root.replace(':3001','')
        }

        this.$http.post('correos.promo', payload).then(response=>{
          this.text = 'Correos envíados'
          this.color = 'success'
          this.snackbar = true
          console.log(response)
        })

        console.log(this.$http.options.root.replace(':3001',''))
        console.log(payload)
      },

      nextStep (n) {
        if (n === this.steps) {
          this.e1 = 1
        } else {
          this.e1 = n + 1
        }
      },

    },

  }
</script>





