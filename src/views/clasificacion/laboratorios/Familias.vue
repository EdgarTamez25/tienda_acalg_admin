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

    <v-row>
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="familias"
          sort-by="estatus"
          class="elevation-1"
          :search="search"
          dense
          :loading="loading"
        >
          <template v-slot:top>
            <v-toolbar
              flat
            >
              <v-toolbar-title>Familias</v-toolbar-title>
              <v-divider
                class="mx-4"
                inset
                vertical
              ></v-divider>
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
                      <v-text-field
                        v-model="editedItem.familia"
                        label="Familia"
                        outlined
                        dense
                        :rules="[v => !!v || 'Campo requerido']"
                      ></v-text-field>

                      <v-checkbox 
                        label="Estatus" 
                        v-model="editedItem.estatus" 
                      >
                      </v-checkbox>
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

              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
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
              Reset
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
              Reset
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
  export default {
    data: () => ({
    	loading: false,
      valid: true,
      search:'',
      text:'',
      color:'',
      snackbar: false,
      dialog: false,
      dialogDelete: false,
      headers: [
        { text: 'Id', align: 'left',sortable: false, value: 'idfamilias'},
        { text: 'Nombre', align: 'left',sortable: false, value: 'familia'},
        { text: 'Estatus', align: 'left',sortable: false, value: 'estatus'},
        { text: 'Editar', align: 'left',sortable: false, value: 'editar'},
      ],

      familias: [],
      editedIndex: -1,
      editedItem: {
        idfamilias:0,
        familia: '',
        estatus: 0,
      },
      defaultItem: {
        idfamilias:0,
        familia: '',
        estatus: 0,
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nueva Familia' : 'Editar Familia'
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

      initialize () {
      	this.loading = true
        this.familias = []
        this.$http.get('familias.all').then(response =>{
          this.loading = false
          this.familias = response.body

          this.familias.forEach(element=>{
            element.estatus == 1 ? true:false
          })
      		this.loading = false

        })
      },

      editItem (item) {
        this.editedIndex = this.familias.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      	this.$refs.form.resetValidation()
      	this.$refs.form.reset()
      },

      deleteItem (item) {
        this.editedIndex = this.familias.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        this.familias.splice(this.editedIndex, 1)
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
        if(this.$refs.form.validate()){
          this.editedItem.estatus == false ? 0 : 1

          if (this.editedIndex > -1) {
            this.$http.put('familias.update/'+ this.editedItem.idfamilias, this.editedItem).then(response=>{
              this.text  = 'Familia actualizada'
              this.snackbar = true
              this.color = 'green'
              this.initialize()
            })
          } else {
            this.$http.post('familias.add', this.editedItem).then(response=>{
              this.text  = 'Familia agregada'
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