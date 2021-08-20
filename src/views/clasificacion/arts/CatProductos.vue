<template>
  <v-container>

     <v-row>
      <v-col cols="12">
        <v-data-table
          :loading="loading"        
          :headers="headers"
          :items="productos"
          sort-by="estatus"
          class="elevation-1"
          :search="search"
          dense
        >
          <template v-slot:top>
            <v-toolbar
              flat
            >
              <v-toolbar-title>Catálogo de Artículos</v-toolbar-title>
              <v-divider
                class="mx-4"
                inset
                vertical
              ></v-divider>
              <v-spacer></v-spacer>
              <v-btn align="right" 
                color="primary" dark small 
                class="ma-2" 
                :to="{ name: 'newproducto' }" >Nuevo
              </v-btn>
            </v-toolbar>
            <v-row>
              <v-col cols="12">
                <v-card-text class="py-0">
                  <v-text-field
                    prepend-inner-icon="mdi-magnify"
                    label="Buscar"
                    id="id"
                    outlined
                    dense
                    v-model="search"
                  ></v-text-field>
                </v-card-text>
              </v-col>
            </v-row>
          </template>
          <template v-slot:item.editar="{ item }">
            <v-icon
              small
              class="mr-2"
              @click="edit(item)"
              color="blue"
            >
              mdi-pencil
            </v-icon>
          </template>
          <template v-slot:no-data>
            <v-btn
              color="primary"
              @click="initialize"
            >
              Actualizar
            </v-btn>
          </template>

          <template v-slot:item.estatus="{ item }">
            <v-chip v-if="item.estatus == 1" color="green" dark small>Activo</v-chip>
            <v-chip v-else color="red" dark small>Inactivo</v-chip>
          </template>

          <template v-slot:no-data>
            <v-btn
              color="primary"
              @click="initialize"
            >
              Actualizar
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
  import {mapActions, mapGetters} from 'vuex'
  import XLSX from 'xlsx'

  export default {
    // mixins:[excelMixin],

    data: () => ({
      downloadLoading:false,

      loading: true,
      longitud:5,
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      search:'',
      productos:[],
      headers: [
        { text: 'Codgio', align: 'left', value: 'codigo'},
        { text: 'Nombre', align: 'left', value: 'nomart'},
        { text: 'Precio', align: 'left', value: 'precio1'},
        { text: 'Familia',               value: 'familia' },
        { text: 'Categoria',             value: 'categoria' },
        { text: 'Subcategoria',          value: 'subcategoria' },
        { text: 'Editar',                value: 'editar' },
      ],

      url: '',

      
    }),

    created(){
      this.url = this.$http.options.root + 'fotos/'
      this.initialize()
    },

    methods:{
      ...mapActions('productos',['traerProductos','addImg', 'verProducto']),
      initialize(){
        this.productos = []
        this.loading = true
        this.$http.get('articulos.list').then(response =>{
          this.loading = false
          this.productos = response.body
        }).catch(error=>{this.loading = false})
      },
      
      // EXCEL
      exportar(){
        let xls = {
          data:      this.productos,
          tHeaders : ['Codigo','Nombre', 'Sal', 'Labortorio'],
          filterVal: ['codigo','nomart', 'sal', 'lab'],
          nomfile :  "Productos"
        }
        this.exportExcel()
      },

      s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
      },

      exportExcel(){
        this.productos.sort((a , b)=>{
          if (a.nomart > b.nomart) {
            return 1;
          }
          if (a.nomart < b.nomart) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });

        let data = XLSX.utils.json_to_sheet(this.productos)
        const workbook = XLSX.utils.book_new()
        const filename = 'Productos'
        XLSX.utils.book_append_sheet(workbook, data, filename)

        var wbout = XLSX.write(workbook, {
          bookType: 'xls',
          bookSST: false,
          type: 'binary'
        });

        const file = new File([new Blob([this.s2ab(wbout)])], filename + '.xls')
        console.log(file)
        
        let formData = new FormData();
        // //se crea el objeto y se le agrega como un apendice el archivo 
        formData.append('file',file);
        // /*Initialize the form data*/
        console.log('formData', formData)

        this.$http.post('pdfs',formData).then(response=> {
          // alert(response.body)
          window.location = this.$http.options.root + 'pdfs/' + filename + '.xls'
        }).catch(error=> {
          alert(error.body)
          console.log(error);
        });

      },

      edit(item){
        this.verProducto(item)
        this.$router.push({name:'tabproducto', params: {id: item.codigo}})
      }
    },

    computed:{
      ...mapGetters('productos',['getProductos'])
    }

  }
</script>





