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
    <v-row row wrap>

      <v-card width="100%" height="100%">
        <v-card-title primary-title>
          Novedades y Destacados
          <v-spacer></v-spacer>
          <v-btn 
            class="ma-2" 
            small dark color="primary"
            @click="exportar()">
            <v-icon>save_alt</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Buscar Productos"
            outlined
            dense
          ></v-text-field>
              
          <v-data-table
            :loading="loading"        
            :headers="headers"
            :items="productos"
            class="elevation-1"
            fixed-header
            height="450"
            hide-default-footer
            loading-text="Cargando..."
            dense
            :search="search"
            :items-per-page="longitud"
            :mobile-breakpoint="250"
          >

            <!-- STATUSWEB -->
            <template v-slot:no-data>
              <v-alert type="info" color="primary" outlined :value="true">
                No hay datos para mostrar
              </v-alert>
            </template>

            <template v-slot:item.novedades = "{item}">
              <v-checkbox v-model="item.novedades" dense hide-details class="mt-0" @change="novedades(item)"></v-checkbox>
            </template>

            <template v-slot:item.destacados = "{item}">
              <v-checkbox v-model="item.destacados" dense hide-details class="mt-0" @change="novedades(item)"></v-checkbox>
            </template>

                    
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-row>  
  </v-container>
</template>


<script>
  import XLSX from 'xlsx'

  export default {

    data: () => ({
      text:'',
      snackbar:false,
      color:'',


      loading: true,
      longitud:5,
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      search:'',
      productos:[],
      headers: [
        { text: 'Nombre', align: 'left',sortable: false, value: 'nomart'},
        { text: 'Familia',               value: 'familia' },
        { text: 'Categoria',             value: 'categoria' },
        { text: 'Subcategoria',          value: 'subcategoria' },
        { text: 'Novedades',             value: 'novedades' },
        { text: 'Destacados',            value: 'destacados' },

      ],
    }),

    created(){
      this.init()
    },

    methods:{

      init(){
        this.$http.get('articulos.activos').then(response =>{
          this.productos = response.body
          this.longitud = this.productos.length
          this.loading = false

          this.productos.forEach(element=>{
            element.novedades == 1 ? element.novedades = true: element.novedades = false
            element.destacados == 1 ? element.destacados = true: element.destacados = false
          })
        }).catch(error=>{console.log(error)})
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

      novedades(item){
        item.novedades == true?  item.novedades = 1:  item.novedades  = 0
        item.destacados == true? item.destacados = 1: item.destacados = 0
        this.$http.put('articulos.novedades/' + item.id, item).then(response=>{
          console.log(response)
          this.text = 'Articulo actualizado'
          this.color = 'success'
          this.snackbar = true
          this.init()
        }).catch(error=>{
          console.log(error)
        })
      },

    },

  }
</script>





