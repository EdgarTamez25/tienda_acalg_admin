<template>
  <v-container>
    <v-snackbar
      v-model="snackbar"
      :timeout="8000"
      top
      :color="color" 
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

    <v-row row wrap>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="salidas"
          class="elevation-1"
          :search="search"
          dense
        >
          <template v-slot:top>

            <v-card-title primary-title class="pb-0">
              Catálogo de Salidas
              <v-spacer></v-spacer>
              <v-text-field
                dense
                v-model="search"
                append-icon="search"
                label="Buscar salidas"
                single-line
                hide-details
                outlined
                dense
              ></v-text-field>


              <v-spacer></v-spacer>
            
              <!-- NUEVO -->
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                  small
                >
                  Agregar
                </v-btn>
              </template>


              <!-- BOTON EXCEL -->
            
              <v-spacer></v-spacer>
              <v-dialog
                v-model="dialog"
                max-width="500px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                    small
                  >
                    Agregar
                  </v-btn>
                </template>
                <v-form
                  ref="form"
                  v-model="valid"
                  lazy-validation
                >
                  <v-card>
                    <v-card-title>
                      <span class="text-h5">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text class="pb-0">
                      <v-row>
                        <v-col cols="12" class="pb-0">
                          <v-autocomplete
                            v-model="producto"
                            :items="salidas"
                            label="Producto"
                            return-object
                            item-text="nomart"
                            item-value="id"
                            :rules="[v => !!v || 'Campo requerido']"
                            outlined
                            dense
                          ></v-autocomplete>
                        </v-col>

                        <v-col cols="12" md="6">
                          <v-text-field
                            v-model="cant"
                            outlined
                            dense
                            type="number"
                            label="Cantidad"
                            :rules="[v => !!v || 'Campo requerido']"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="6">
                          <v-text-field
                            outlined
                            dense
                            v-model="fechaentr"
                            label="Fecha de salida"
                            type="date"
                            :rules="[v => !!v || 'Campo requerido']"
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12">
                          <v-text-field
                            outlined
                            dense
                            v-model="recibio"
                            label="Recibió"
                            :rules="[v => !!v || 'Campo requerido']"
                          ></v-text-field>
                        </v-col>
                      </v-row>


                    </v-card-text>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="close"
                      >
                        Cancelar
                      </v-btn>
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="save"
                      >
                        Guardar
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-form>
              </v-dialog>
            </v-card-title>
            <v-row>
              <v-col cols="12">
                <v-card-text class="py-0">
                  <v-row class="pb-0">
                    <v-col cols="12" sm="6" md="4" lg="3" class="pb-0">
                      <v-text-field
                        dense
                        v-model="inicio"
                        label="Fecha de inicio"
                        hide-details
                        type="date"
                        outlined
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6" md="4" lg="3" class="pb-0">
                      <v-text-field
                        dense
                        v-model="fin"
                        label="Fecha de fin"
                        hide-details
                        type="date"
                        outlined
                      ></v-text-field>
                    </v-col>
                    
                    <v-col cols="12" sm="6" md="4" lg="3">
                      <v-btn color="success" @click="filtroFechas()" small class="mr-2"><v-icon>search</v-icon></v-btn>
                      <v-btn color="success" @click="initialize()" small>Todo</v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-col>
            </v-row>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon
              small
              class="mr-2"
              @click="editItem(item)"
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

    data: () => ({
      inicio:new Date().toISOString().substr(0, 10),
      fin:new Date().toISOString().substr(0, 10),
      menu: false,
      menu2: false,

      loading: true,
      longitud:5,
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      search:'',
      salidas:[],
      headers: [
        { text: 'Articulo', align: 'left',sortable: false, value: 'nomart'},
        { text: 'Cantidad',  value: 'cant' },
        { text: 'Salida',    value: 'fecha' },
        { text: 'Recibió',   value: 'recibio' },
        { text: 'entrego',   value: 'nomuser' },

      ],

      valid: true,
      search:'',
      text:'',
      color:'',
      snackbar: false,
      dialog: false,
      dialogDelete: false,
      categorias: [],
      editedIndex: -1,
      editedItem: {
        idlaboratorios:0,
        nomlab: '',
        estatus: 0,
      },
      defaultItem: {
        idlaboratorios:0,
        nomlab: '',
        estatus: 0,
      },

      salidas:[],
      producto:null,
      cant:'',
      fechaentr:null,
      recibio:'',
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nueva entrada' : 'Editar entrada'
      },
      ...mapGetters('Login', ['getdatosUsuario', 'getLogeado']),
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    created(){
      this.initialize()
    },
    methods:{

      initialize(){
        this.salidas= []
        this.$http.get('salidas.list').then(response =>{
          if(response == null){
            this.loading = false
            this.salidas = []
          }else{
            this.loading = false
            this.salidas = response.body
            this.salidas.forEach(element=>{
              element.fecha = element.fecha.substr(0,10)
            })
            this.longitud = this.salidas.length
          }
        })
      },

      // EXCEL
      exportar(){
        let xls = {
          data:      this.salidas,
          tHeaders : ['Codigo', 'Nombre', 'Fecha de Salida', 'Lote', 'Recibio', 'Entrego'],
          filterVal: ['codigo', 'nomart', 'fecha',           'lote', 'recibio', 'entrego'],
          nomfile :  "Salidas"
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
        this.salidas.sort((a , b)=>{
          if (a.nomart > b.nomart) {
            return 1;
          }
          if (a.nomart < b.nomart) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });
        let data = XLSX.utils.json_to_sheet(this.salidas)
        const workbook = XLSX.utils.book_new()
        const filename = 'Salidas'
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

      existencias(){
        this.$http.get('existencias.codigo/' + this.codigo2).then(response =>{
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

      filtroFechas(){
        this.salidas= []
        var payload = {
          inicio: this.inicio,
          fin:    this.fin
        }
        this.$http.post('salidas.fecha',payload).then(response =>{
          if(response == null){
            this.loading = false
            this.salidas = []
          }else{
            this.loading = false
            this.salidas = response.body
            this.longitud = this.salidas.length
          }

          this.salidas.forEach(element=>{
            element.fecha = element.fecha.substr(0,10)
          })
        })
      },

      editItem (item) {
        this.editedIndex = this.categorias.indexOf(item)
        this.editedItem = Object.assign({}, item)
        console.log(this.editedItem)
        for(const i in this.productos){
          if(this.productos[i].codigo == this.editedItem.codigo){
            this.producto = this.productos[i]
          }
        }
        this.cant      = this.editedItem.cant
        this.cant      = this.editedItem.cant
        this.fechaentr = this.editedItem.fechaentr
        this.dialog = true
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },


      save () {
        if(this.$refs.form.validate()){
          this.editedItem.estatus == false ? 0 : 1

          if (this.editedIndex > -1) {
            
          } else {
            var payloadSalida = {
              codigo:    this.producto.codigo,
              cant:      this.cant,
              recibio:   this.recibio,
              fecha:     new Date().toISOString().substr(0, 10),
              entrego:   this.getdatosUsuario.idusuariosweb
            }
            this.$http.post('salidas.add', payloadSalida).then(response=>{
              this.text  = 'Salida exitosa'
              this.snackbar = true
              this.color = 'green'
              this.initialize()
            })
          }
          this.close()
        }
      },
    },

  }
</script>





