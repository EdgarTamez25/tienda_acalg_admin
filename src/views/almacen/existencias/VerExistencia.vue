<template>
  <v-container>
    <v-row row wrap>

      <v-card width="100%" height="100%">
        <v-card-title primary-title>
          Desgloce de Existencias

          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Buscar Productos"
            single-line
            hide-details
          ></v-text-field>

          <v-spacer></v-spacer>
          
          <!-- BOTON EXCEL -->
          <v-btn 
            class="ma-2" 
            small dark color="warning"
            :to="{name:'catexistencia'}">
            Regresar
          </v-btn>

        </v-card-title>
              
        <v-data-table
          :loading="loading"        
          :headers="headers"
          :items="productos"
          class="elevation-1"
          height="450"
          hide-default-footer
          loading-text="Cargando..."
          dense
          :search="search"
          :items-per-page="longitud"
          :mobile-breakpoint="200"
        >
          <!-- fixed-header -->
          <template v-slot:item="{ item }" >
           <tr v-on:dblclick="edit(item.codigo)">
             <td>{{ item.nomart}}</td>
             <td>{{ item.cant }}</td>
             <td>{{ item.caducidad }}</td>
             <td>{{ item.lote }}</td>
             <td>{{ item.lab }}</td>
             <td>{{ item.sal }}</td>
           </tr>
                   
         </template>

          <!-- STATUSWEB -->
          <template v-slot:no-data>
            <v-alert type="info" color="primary" outlined :value="true">
              No hay datos para mostrar
            </v-alert>
          </template>
        </v-data-table>
      </v-card>
    </v-row>  
  </v-container>
</template>


<script>
  import {mapActions, mapGetters} from 'vuex'
  import XLSX from 'xlsx'

  
  export default {

    data: () => ({
    	
      loading: true,
      longitud:5,
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      search:'',
      productos:[],
      headers: [
        { text: 'Nombre', align: 'left',sortable: false, value: 'nomart'},
        { text: 'Cantidad', value: 'cant' },
        { text: 'Caducidad', value: 'caducidad' },
        { text: 'Lote', value: 'lote' },
        { text: 'Laboratorio', value: 'lab' },
        { text: 'Sal', value: 'sal' },
        
      ],
    }),

    created(){
      this.$http.get('existencias.codigo/' + this.getExistencia.codigo).then(response =>{
        if(response == null){
          this.loading = false
          this.productos = []
        }else{
          this.loading = false
          this.productos = response.body
          this.longitud = this.productos.length
        }
      })
    },

    methods:{
      // EXCEL
    },

    computed:{
      ...mapGetters('productos',['getExistencia']),

    }

  }
</script>





