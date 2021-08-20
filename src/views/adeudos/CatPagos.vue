<template>
  <v-container>
    <v-row>
      <v-col col="12" >
        <!-- TABLA -->
          <v-data-table
            :loading="loading" 
            :headers="headers"
            :items="pagos"
            :search="search"
            :items-per-page="pagos.length"
            hide-default-footer
            class="elevation-1"
            loading-text="Cargando..."
            dense
            fixed-header
            height="440"
          >
            <template v-slot:item="{ item }" >
              <tr v-on:dblclick="facturas(item.idpagos)">
                <td>{{ item.idpagos}}</td>
                <td>{{ item.nomcli}}</td>
                <td>{{ item.concepto}}</td>
                <td>{{ item.fecha}}</td>
                <td>{{ item.fechalim}}</td>
                <td>{{ item.importe}}</td>
                <td>{{ item.pagado}}</td>
                <td v-if="item.importe < item.pagado">{{ item.faltante}}</td>
                <td v-else>{{ item.importe - item.pagado}}</td>
                <td>
                	<v-chip
                		v-if="item.importe <= item.pagado"
							      color="success"
							      text-color="white"
							      small
							    >
							      Pagada
							    </v-chip>
							    <v-chip
							    	v-else
							      color="warning"
							      text-color="white"
							      small
							    >
							      Pendiente
							    </v-chip>
                </td>
                <td><v-btn  @click="editar(item.idpagos)" icon><v-icon>edit</v-icon></v-btn></td>
              </tr>
            </template>

            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>Adeudos</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="search"
                  append-icon="search"
                  label="Buscar Adeudo"
                  single-line
                  hide-details
                ></v-text-field>
                
                <v-spacer></v-spacer>
              
                <!-- //NUEVO -->
                <v-btn align="right" 
                  color="primary" dark small
                  class="ma-2" 
                  :to="{ name: 'newpagos' }" >Nuevo Adeudo
                </v-btn>


                <!-- BOTON EXCEL -->
                <v-btn
                  class='ma-2' 
                  small dark color= "warning"
                  @click="exportar()">
                  <v-icon>save_alt</v-icon>
                </v-btn>
              </v-toolbar>
            </template>

          </v-data-table>
        </v-col>
      </v-row>  
    </v-row>
  </v-container>
</template>

<script>

  export default {

    data () {
      return {
        loading: true,
        page: 1,
        pageCount: 0,
        itemsPerPage: 10,
        search: '',
        headers: [
          { text: 'ID', align: 'left',sortable: false, value: 'idpagos' },
          { text: 'Cliente'          , value: 'nomcli' },
          { text: 'Concepto'         , value: 'concepto' },
          { text: 'Fecha'            , value: 'fecha' },
          { text: 'Fecha limite'     , value: 'fechalim' },
          { text: 'Importe'          , value: 'importe' },
          { text: 'Pagado'           , value: 'pagado' },
          { text: 'Faltante'         , value: 'faltante' },
          { text: 'Estatus'          , value: 'estatus' },
          { text: 'Editar'           , value: 'editar' },
        ],

        pagos: [{}],
        nomclis :[],

        pagosAll: [],
        pagosArr:[],

        descriptionLimit: 60,
        entries: [],
        isLoading: false,
        model: null,
        search2: null,

      }
    },

    created () {
     this.consultar()
    },

    methods:{

      exportar(){
        let xls = {
          data:     this.pagos, 
          tHeaders : ['ID', 'Nombre', 'Nombre Comercial'],
          filterVal: ['idweb', 'nomcli', 'nomcomer'],
          nomfile : "Consulta de pagos"
        }
        // console.log(xls)
         this.exportarXls(xls)
      },
        

      // Consulto todos los pagos
      consultar(){
        this.loading = true
        this.$http.get('pagos.list').then(response=>{
          // console.log('response', response.body)
          this.pagos = response.body

        }).catch(error=>{
          console.log(error)
        }).finally(()  => this.loading = false) 
      },

      editar(item){
        // console.log('item', item)
        this.$router.push({name:'editpagos', params: {id: item}})
      },

      facturas(item){
        // console.log('item', item)
        this.$router.push({name:'catfacturas', params: {id: item}})
      }

    },

  };
</script>


