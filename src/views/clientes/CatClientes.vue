<template>
  <v-data-table
    :headers="headers"
    :items="clientes"
    sort-by="calories"
    class="elevation-1"
    :search="search"
  >
    <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>Clientes</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-text-field
          name="name"
          label="Buscar"
          id="id"
          v-model="search"
          hide-actions
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              Nuevo cliente
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.nomcli"
                      label="Nombre cliente"
                    ></v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.nomcomer"
                      label="Nombre comercial"
                    ></v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.rfc"
                      label="RFC"
                    ></v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.email1"
                      label="Email"
                    ></v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.telefono"
                      label="Teléfono"
                    ></v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.calle"
                      label="Teléfono"
                    ></v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.numext"
                      label="Num. Ext"
                    ></v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.numint"
                      label="Num. Int."
                    ></v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.colonia"
                      label="Colonia"
                    ></v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.ciudad"
                      label="Ciudad"
                    ></v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.cp"
                      label="CP"
                    ></v-text-field>
                  </v-col>

                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.estado"
                      label="Estado"
                    ></v-text-field>
                  </v-col>

                </v-row>
              </v-container>
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
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <!-- <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon> -->
    </template>
    <template v-slot:no-data>
      <v-btn
        color="primary"
        @click="initialize"
      >
        Reset
      </v-btn>
    </template>
  </v-data-table>
</template>


<script>
  var accounting = require("accounting");
  var md5     = require('md5')

  export default {

    data: () => ({
      search:'',
      dialog: false,
      headers: [
        { text: 'ID', align: 'left',sortable: false, value: 'idweb' },
        { text: 'Nombre'  , value: 'nomcli' },
        { text: 'Email'    , value: 'email1' },
        { text: 'Teléfono', value: 'telefono'},  
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      dialogDelete: false,
      clientes: [],
      editedIndex: -1,
      editedItem: {
        diweb: '',
        calle: '',
        ciudad:'',
        colonia:'',
        cp:'',
        email1:'',
        estado:'',
        nomcli:'',
        nomcomer:'',
        numext:'',
        numint:'',
        rfc:'',
        telefono:''
      },
      defaultItem: {
        diweb: '',
        calle: '',
        ciudad:'',
        colonia:'',
        cp:'',
        email1:'',
        estado:'',
        nomcli:'',
        nomcomer:'',
        numext:'',
        numint:'',
        rfc:'',
        telefono:''
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nuevo cliente' : 'Editar/Ver Cliente'
      },
    },


    
    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    created () {
      this.initialize()
    },


    methods: {
       editar(item){
        this.$router.push({name:'newusuario', 
              params: {idweb: item.idweb}})
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


      initialize  () {
        //Consultar Usuarios
        this.loading = true
        this.$http.post('clientes.list').then( response => {
          this.clientes= response.body
        }).catch(error => {
          console.log(error)
        }).finally(()  => this.loading = false) 

      },  

      editItem (item) {
        this.editedIndex = this.clientes.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.clientes.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        this.clientes.splice(this.editedIndex, 1)
        this.closeDelete()
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        if (this.editedIndex > -1) {
          this.$http.put('clientes.update/' + this.editedItem.idweb,this.editedItem).then( response => {
            this.initialize()
          }).catch(error => {
            console.log(error)
          }).finally(()  => this.loading = false)
        } else {
          // this.clientes.push(this.editedItem)
          this.$http.post('clientes.add',this.editedItem).then( response => {
            this.initialize()
          }).catch(error => {
            console.log(error)
          }).finally(()  => this.loading = false)
        }
        this.close()
      },
    },
  }
</script>