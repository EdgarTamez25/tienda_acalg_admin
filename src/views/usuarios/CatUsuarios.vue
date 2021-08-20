<template>
  <v-container>
    <v-row>

      <v-card width="100%" height="100%">
        <v-card-title primary-title>
          Catálogo de Usuarios

          <v-spacer></v-spacer>

          <v-text-field
            v-model="search"
            append-icon="search"
            label="Buscar Usuarios"
            single-line
            hide-details
          ></v-text-field>

          <v-spacer></v-spacer>
          
          <!-- NUEVO -->
          <v-btn align="right" 
            color="primary" dark small 
            class="ma-2" 
            :to="{ name: 'newusuario' }" >Nuevo
          </v-btn>

          <!-- BOTON EXCEL -->
          <v-btn 
            class="ma-2" 
            small dark color="warning"
            @click="exportar()">
            <v-icon>save_alt</v-icon>
          </v-btn>

        </v-card-title>
              
        <v-data-table
          :loading="loading"        
          :headers="headers"
          :items="usuarios"
          class="elevation-1"
          fixed-header
          height="450"
          hide-default-footer
          loading-text="Cargando..."
          dense
          :search="search"
          :items-per-page=200
        >

          <template v-slot:item="{ item }" >
           <tr>
              <td>{{ item.idusuariosweb }}</td>
              <td>{{ item.nomper }}</td>
              <td>{{ item.nomuser }}</td>
              <td>{{ item.email }}</td>
              <td>{{ item.nivel }}</td>
              <td v-if="item.estatus == 2" class="green--text">ACTIVO</td>
              <td v-if="item.estatus == 1" class="red--text">BAJA</td>
              <td v-if="item.estatus == 0" class="orange--text">INACTIVO</td>
              <td><v-btn color="primary" icon @click="editar(item)"><v-icon color="primary">edit</v-icon></v-btn></td>
           </tr>
                   
         </template>
        </v-data-table>
      </v-card>
    </v-row>  
  </v-container>
</template>


<script>
  var accounting = require("accounting");
  var md5     = require('md5')

  export default {

    data: () => ({
      dialog: false,
      headers: [
        { text: 'ID', align: 'left',sortable: false, value: 'idusuariosweb' },
        { text: 'Nombre'  , value: 'nomper' },
        { text: 'Usuario'  , value: 'nomuser' },
        { text: 'Email'    , value: 'email' },
        { text: 'Nivel', value: 'nivel'},  
        { text: 'Estatus', value: 'estatus'},  
        { text: 'Editar', value: 'editar'},  
      ],

      search: '',
      loading: false,
      usuarios: [],
           
    }),

    
    created () {
      this.init()
    },

    methods: {
       editar(item){
        this.$router.push({name:'newusuario', 
              params: {idusuariosweb: item.idusuariosweb}})
      },


      // EXCEL
      exportar(){
        let xls = {
          data:      this.usuarios,
          tHeaders : ['ID', 'Usuario', 'Email', 'Cliente', 'Nombre Cliente', 'ID Vend', 'Vendedor', 'Nivel'],
          filterVal: ['idusuariosweb', 'Nomuser', 'Email', 'numcli', 'Nomcli', 'idvend', 'Nomvend', 'nivel'],
          nomfile :  "Consulta de Usuarios"
        }
        // console.log(xls)
         this.exportarXls(xls)
      },


      init () {
        //Consultar Usuarios
        this.loading = true
        this.$http.get('users').then( response => {
          this.usuarios= response.body
        }).catch(error => {
          console.log(error)
        }).finally(()  => this.loading = false) 

      },  



    },

  }
</script>