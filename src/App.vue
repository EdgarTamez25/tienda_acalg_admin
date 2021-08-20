<template>
  <v-app id="inspire">

    <v-app-bar
      v-if="getLogeado == true"
      app
      dense
      color="primary"
      dark
    >
      <v-toolbar-title class="ml-0 pl-4">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-if="getLogeado == true"></v-app-bar-nav-icon>
        <span>Administración de la tienda</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn  text dark v-if="getLogeado == true" class="mr-4" :to="{name: 'myperfil'}">
        <v-icon left>person</v-icon>
        Perfil
      </v-btn>
      <v-btn icon @click="salir" v-if="getLogeado == true">
        <v-icon>exit_to_app</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-if="getLogeado == true"
      v-model="drawer"
      app
      >

      <v-container>
        <v-flex xs12 text-xs-center>
          <img src="@/assets/logo.png" alt="alt" max-height="80" width="200" align="center">
        </v-flex>
      </v-container>
     <v-card-text class="primary pa-1 white--text" align="center">
        {{ getdatosUsuario.nomuser }}
      </v-card-text>

      
      
      <v-list dense>
        <template >
          <v-list-item :to="{name: 'home'}">
            <v-list-item-content >
              <v-list-item-title >
                Home
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon>home</v-icon>
            </v-list-item-action>
          </v-list-item>
        </template>

        <!-- <template >
          <v-list-item :to="{name: 'pedidos'}">
            <v-list-item-content >
              <v-list-item-title >
                Pedidos
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon>shopping_basket</v-icon>
            </v-list-item-action>
          </v-list-item>
        </template> -->
        
        <template v-for="item in items">
          <v-layout
            v-if="item.heading"
            :key="item.heading"
            align-center
          >
          </v-layout>

          <v-list-group
            v-else-if="item.children"
            :key="item.text"
            v-model="item.model"
            append-icon="item.icon"
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
          >
            <v-list-item
              v-for="(child, i) in item.children"
              :key="i"
              :to="child.path"
            >
              <v-list-item-content >
                <v-list-item-title >
                  {{ child.text }}
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-item-action>
            </v-list-item>
            
            <template v-slot:activator>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title> 
                   {{ item.text}}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>

          </v-list-group>
        </template>
      </v-list>
    </v-navigation-drawer>



    <!-- Ruteo de vistas -->
    <v-content>
      <v-container fluid >
        <v-slide-y-transition mode="out-in">
          <router-view/>
        </v-slide-y-transition>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import store from '@/store'
import {mapGetters, mapActions} from 'vuex'

  export default {
    props: {
      source: String,
    },
    data: () => ({
      logo:'',
      snackbar: false,
      drawer: null,
      items: [
        {
          icon: 'chrome_reader_mode', 'icon-alt': 'keyboard_arrow_down', text: 'Clasificar Productos',
          model: false,
          children: [
            { text: 'Catálogo de articulos'  ,path: 'catproductos' ,      icon:'chrome_reader_mode'},
            { text: 'Familias'               ,path: 'familias',           icon:'bookmarks'},
            { text: 'Categorías'             ,path: 'catlab',             icon:'bookmarks'},
            { text: 'Subcategoria'           ,path: 'subcatego',          icon:'bookmarks'},
          ],
        },
        {
          icon: 'inbox', 'icon-alt': 'keyboard_arrow_down', text: 'Almácen',
          model: false,
          children: [
            // { text: 'Catálogo de articulos'  ,path: 'catproductosalm' ,   icon:'chrome_reader_mode'},
            // { text: 'Laboratorios'           ,path: 'catlab',             icon:'local_hospital'},
            { text: 'Entradas  '             ,path: 'catentradas'  ,      icon:'book'},
            { text: 'Salidas'                ,path: 'catsalidas',         icon:'bookmarks'},
            // { text: 'Existencias'            ,path: 'catexistencia' ,     icon:'store'},
            // { text: 'Discrepancias'          ,path: 'catdiscre',          icon:'assignment'},
          ],
        },
        {
          icon: 'calendar_view_day', 'icon-alt': 'keyboard_arrow_down', text: 'Configuración',
          model: false,
          children: [
            { text: 'Usuarios'     ,path: 'catusuarios',   icon:'group'},
            // { text: 'Clientes'     ,path: 'catclientes',   icon:'group'},
            { text: 'Configurar'   ,path: 'Configurar',    icon:'settings'},
            // { text: 'Pagos     '   ,path: 'catpagos',      icon:'settings'},
          ], 
        },

        {
          icon: 'style', 'icon-alt': 'keyboard_arrow_down', text: 'Marketing',
          model: false,
          children: [
            { text: 'Banners'     ,path: 'banners',     icon:'photo_library'},
            { text: 'Novedades'   ,path: 'novedades',   icon:'loyalty'},
            // { text: 'Envío de promociones'   ,path: 'promos',   icon:'email'},
          ], 
        },
        
       
      
      ],
    }),

    created(){
      // this.traerTema(1)
      this.$http.get('config.list').then(response=>{
        this.ciaws = response.body
        this.logo = this.$http.options.root + 'fotos/' + this.ciaws.logourl
        this.color()
      }, error => {
        console.log(error)
      })
    },

    methods:{
      ...mapActions('tema',['traerTema']),
      ...mapActions('Login', ['salirLogin']),
      color(){
        this.$vuetify.theme.themes.light.primary = this.ciaws.primario
        this.$vuetify.theme.themes.light.secondary = this.ciaws.secundario
        this.$vuetify.theme.themes.light.success = this.ciaws.correcto
        this.$vuetify.theme.themes.light.info = this.ciaws.informatico
        this.$vuetify.theme.themes.light.error = this.ciaws.errores
        this.$vuetify.theme.themes.light.warning = this.ciaws.peligro
      },

      salir(){
        this.salirLogin()
        // Mando a llamar la accion salir
        this.$store.dispatch("salir")
      },

    },

    computed:{
     ...mapGetters('Login', ['getdatosUsuario', 'getLogeado']),
     ...mapGetters('tema', ['getTema']),
    
      logueado(){
        return this.$store.state.usuario;
      },
    }
}



</script>


