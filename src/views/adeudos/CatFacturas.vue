<template>
  <v-container>
    
    <v-data-table
      :headers="headers"
      :items="facturas"
      item-key="numfact"
      class="elevation-1"
      :loading="loading" 
      :search="search"
      :items-per-page="longitud"
      hide-default-footer
      fixed-header
      height="440"

    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Facturas</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Buscar Factura"
            single-line
            hide-details
          ></v-text-field>
          
          <v-spacer></v-spacer>

          <v-btn align="right" 
            color="secondary" dark small
            class="ma-2" 
            :to="{ name: 'catpagos' }" >Regresar
          </v-btn>

        
          <!-- //NUEVO -->
          <v-btn align="right" 
            color="primary" dark small
            class="ma-2" 
            @click="newFac()">Nuevo Factura
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

      <template v-slot:item.estatus="{ item }">
        <v-chip v-if="(item.importe - item.pagado)<= 0" color="success" small>Pagada</v-chip>
        <v-chip v-else dark color="warning" small>Pendiente</v-chip>
      </template>
      
      <template v-slot:item.faltante="{ item }">
        {{item.importe - item.pagado}}
      </template>

      <template v-slot:item.actions="{ item }">
        <v-btn icon @click="editar(item.idfacturas)" small><v-icon>edit</v-icon></v-btn>
        <v-btn icon @click="ver(item.idfacturas)" small><v-icon>remove_red_eye</v-icon></v-btn>
        <v-btn icon @click="eliminar(item.idfacturas)" small><v-icon>delete</v-icon></v-btn>
       
      </template>
    </v-data-table>
  </v-container>
</template>
<script>
  export default {
    data () {
      return {
        importe: 0,
        idpagos:'',
        loading: true,
        page: 1,
        pageCount: 0,
        itemsPerPage: 10,
        search: '',
        facturas: [],
        nomclis :[],
        longitud:5,

        expanded: [],
        singleExpand: false,
        headers: [
          { text: '#Factura'         , value: 'numfact' },
          { text: 'Fecha'            , value: 'fecha' },
          { text: 'Fecha limite'     , value: 'fvenc' },
          // { text: 'Fecha pago'       , value: 'fpago' },
          { text: 'Importe'          , value: 'importe' },
          { text: 'Estatus'          , value: 'estatus' },
          { text: 'Pagado'           , value: 'pagado' },
          { text: 'Faltante'         , value: 'faltante' },
          { text: 'Actions'          , value: 'actions' },
        ],
      }
    },

    created () {
      this.idpagos = this.$route.params.id
      this.consultar(this.idpagos)
    },

    methods:{

      exportar(){
        let xls = {
          data:     this.facturas, 
          tHeaders : ['ID', 'Nombre', 'Nombre Comercial'],
          filterVal: ['idweb', 'nomcli', 'nomcomer'],
          nomfile : "Consulta de pagos"
        }
        // console.log(xls)
         this.exportarXls(xls)
      },
        

      // Consulto todos los pagos
      consultar(idpagos){
        this.loading = true
        this.$http.get('facturas.list/' + idpagos).then(response=>{
          // console.log('response', response.body)
          this.facturas = response.body
          this.longitud = this.facturas.length

        }).catch(error=>{
          console.log(error)
        }).finally(()  => this.loading = false) 
      },

      edit(item){
        // console.log('item', item)
        this.$router.push({name:'editcliente', params: {id: item}})
      },

      newFac(){
        this.$router.push({name:'newfacturas', params: {id: this.idpagos}})
      },

      editar(idpagos){
        this.$router.push({name:'editafacturas', params: {id: idpagos, regresar:this.idpagos, read: false}})
      },

      ver(idfacturas){
        this.$router.push({name:'catpagoxfac', params: {id: idfacturas, read: true, idpagos: this.idpagos}})
      },

      eliminar(idfacturas){
        this.$http.delete('facturas.delete/' + idfacturas).then(response=>{
          // console.log(response.body)
          this.consultar(this.idpagos)
        }).catch(error=>{
          console.log(error)
        })

      }

    },
  }
</script>