<template>
  <v-container>
    <v-row row wrap>

      <v-card width="100%" height="100%">
        <v-card-title primary-title>
          Calcular Perdidas

          <v-spacer></v-spacer>
          <v-btn 
            class="ma-2" 
            small dark color="warning"
            @click="exportar()">
            <v-icon>save_alt</v-icon>
          </v-btn>

          <v-btn 
            class="ma-2" 
            small dark color="warning"
            @click="comparar()">
            <v-icon>compare_arrows</v-icon>
          </v-btn>
          
          <!-- BOTON EXCEL -->
        </v-card-title>

        <v-card-text>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Buscar Productos"
            single-line
            hide-details
          ></v-text-field>
        </v-card-text>
          

        <v-data-table
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
          <template v-slot:input>
            <v-text-field
              v-model="props.item.nomart"
              label="Edit"
              single-line
              counter
            ></v-text-field>
          </template>

          <template v-slot:input>
            <v-text-field
              v-model="props.item.suma"
              label="Edit"
              single-line
              counter
            ></v-text-field>
          </template>

		      <template v-slot:item.existe="props">
		        <v-edit-dialog
		          :return-value.sync="props.item.existe"
		          @save="save"
		          @cancel="cancel"
		          @open="open"
		          @close="close"
		        > {{ props.item.existe }}
		          <template v-slot:input>
		            <v-text-field
		              v-model="props.item.existe"
		              label="Existe"
		              single-line
		              counter
		              type="number"
		            ></v-text-field>
		          </template>
		        </v-edit-dialog>
		      </template>


		    </v-data-table>

		    <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
		      {{ snackText }}
		      <v-btn text @click="snack = false">Close</v-btn>
		    </v-snackbar>

      </v-card>
    </v-row>
    <v-row>
    	<v-col cols="12">
	    	<v-card>
	    		<v-data-table
			      :headers="headersdis"
			      :items="discrepancias"
			      class="elevation-1"
	          height="450"
	          hide-default-footer
	          loading-text="Cargando..."
	          dense
	          :search="search"
	          :items-per-page="longitud"
	          :mobile-breakpoint="200"
			    >
			  	</v-data-table>
	    	</v-card>
    	</v-col>
    </v-row> 
    <v-snackbar
      v-model="snackbar"
      :timeout="8000"
      top
      color="success" 
      >
      {{text}}
      <v-btn
        color="white"
        text
        @click="snackbar = false"
      >
        Cerrar
      </v-btn>
    </v-snackbar> 
  </v-container>
</template>


<script>
  import {mapActions, mapGetters} from 'vuex'
  import XLSX from 'xlsx'
  

  export default {

    data: () => ({
    	snackbar: false,
    	text:'',

    	snack: false,
      snackColor: '',
      snackText: '',

      loading: true,
      longitud:5,
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      search:'',
      productos:[],
      headers: [
        { text: 'Almacén', value: 'suma' },
        { text: 'Nombre', align: 'left',sortable: false, value: 'nomart'},
        { text: 'Existencia', value: 'existe' },
      ],

    	discrepancias:[],
      headersdis: [
        { text: 'Nombre', align: 'left',sortable: false, value: 'nomart'},
        { text: 'Faltantes', value: 'perdida' },
        { text: 'Sobrantes', value: 'sobrantes' },
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
      // EXCEL
      exportar(){
        let xls = {
          data:      this.discrepancias,
          tHeaders : ['Nombre', 'Faltantes', 'Sobrantes'],
          filterVal: ['nomart', 'perdida', 'sobrantes'],
          nomfile :  "Discrepancias"
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
        this.discrepancias.sort((a , b)=>{
          if (a.nomart > b.nomart) {
            return 1;
          }
          if (a.nomart < b.nomart) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });

        let data = XLSX.utils.json_to_sheet(this.discrepancias)
        const workbook = XLSX.utils.book_new()
        const filename = 'Discrepancias'
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


      save () {
        this.snack = true
        this.snackColor = 'success'
        this.snackText = 'Data saved'
      },

      cancel () {
        this.snack = true
        this.snackColor = 'error'
        this.snackText = 'Canceled'
      },

      open () {
        this.snack = true
        this.snackColor = 'info'
        this.snackText = 'Dialog opened'
      },

      close () {
        console.log('Dialog closed')
      },

      comparar(){
      	this.discrepancias = []
      	this.productos.forEach((element)=>{
      		if(element.suma != element.existe){
      			var x = element.suma - element.existe
      			var val = {}
      			if(x > 0){
	      			val = {
	      				nomart: element.nomart,
	      				perdida: element.suma - element.existe,
	      				sobrantes: ''
	      			}
      				this.discrepancias.push(val)
      			}else{
      				val = {
	      				nomart: element.nomart,
	      				perdida: '',
	      				sobrantes: (element.suma - element.existe) * -1
	      			}
      				this.discrepancias.push(val)
      			}
      		}
      	})
      },

      
    },

  }
</script>





