<template>
  <v-container>
    <v-row row wrap>

      <v-card width="100%" height="100%">
        <v-card-title primary-title>
          Catálogo de Existencias

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
            @click="exportar()">
            <v-icon>save_alt</v-icon>
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
             <td>{{ item.suma }}</td>
             <td>{{ item.lab }}</td>
             <td>{{ item.sal }}</td>
             <td><v-btn icon @click="edit(item)"><v-icon>remove_red_eye</v-icon></v-btn></td>
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
        { text: 'Cantidad', value: 'suma' },
        { text: 'Laboratorio', value: 'lab' },
        { text: 'Sal', value: 'sal' },
        { text: 'Ver', value: '' },
        
      ],
    }),

    created(){
      this.$http.get('existencias.list').then(response =>{
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
      ...mapActions('productos',['verExis']),

      // EXCEL
      exportar(){
        this.$http.get('existencias.total').then(response =>{
          console.log(response)
        }).catch(error=>{console.log(error)})

        
      },

      s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
      },

      exportExcel(value){
        value.sort((a , b)=>{
          if (a.nomart > b.nomart) {
            return 1;
          }
          if (a.nomart < b.nomart) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });

        let data = XLSX.utils.json_to_sheet(value)
        const workbook = XLSX.utils.book_new()
        const filename = 'Existencias'
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


        // console.log('archivo',archivo)

        this.$http.post('pdfs',formData).then(response=> {
          // alert(response.body)
          window.location = this.$http.options.root + 'pdfs/' + filename + '.xls'
        }).catch(error=> {
          alert(error.body)
          console.log(error);
        });

      },

      edit(item){
        this.verExis(item).then(response=>{
          this.$router.push({name:'verexistencia'})
        })
      }

      
    },

  }
</script>





