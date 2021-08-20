<template>  
  <v-container>
    <v-row >  
      <v-col cols="12" lg="8">
        <v-card class="elevation-0">
          <v-card-title primary-title>
            Nuevo artículo

            <v-spacer></v-spacer>
            <!-- BTN ATRAS -->
            <v-btn 
              small
              class="ma-2" 
              color="blue lighten-2" 
              :to="{name:'catproductos'}" 
              dark>Atras
            </v-btn>

            <!-- BTN GUARDAR -->
            <v-btn 
              v-if="existe == false"
              small 
              dark 
              class="ma-2" 
              @click.prevent="agregar"
              color="blue darken-3">Guardar
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="5" lg="6" xl="5">
                <v-text-field
                  clearable
                  label="Ingresar Código"
                  v-model="codigo"
                  dense
                  validate-on-blur
                  class="pa-0"  
                  outlined hide-details 
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col  cols="12">
                <v-text-field
                  v-if="existe == false"
                  label="Nombre del artículo"
                  v-model="nomart"
                  outlined 
                  hide-details 
                  dense
                ></v-text-field>
              </v-col>

              <v-col  cols="12">
                <v-select 
                  outlined
                  v-if="existe == false"
                  :items="familias"
                  v-model="familia"
                  item-text="familia"
                  item-value="idfamilias" 
                  label="Familia"
                  persistent-hint
                  return-object
                  single-line
                  hide-details 
                  dense
                ></v-select>
              </v-col>

              <v-col  cols="12">
                <v-select 
                  outlined
                  v-if="existe == false"
                  :items="categorias"
                  v-model="categoria"
                  item-text="categoria"
                  item-value="idcategorias" 
                  label="Categoría"
                  persistent-hint
                  return-object
                  hide-details
                  single-line
                  dense
                ></v-select>
              </v-col>

              <v-col  cols="12">
                <v-select 
                  outlined
                  v-if="existe == false"
                  :items="subcategorias"
                  v-model="subcategoria"
                  item-text="subcategoria"
                  item-value="idsubcategorias" 
                  label="Subcategoria"
                  persistent-hint
                  return-object
                  hide-details
                  single-line
                  dense
                ></v-select>
              </v-col>

              <v-col  cols="12">
                <v-textarea 
                  v-if="existe == false"
                  v-model = "descrip"
                  outlined
                  dense
                  label="Descripción corta"
                >
                </v-textarea>
              </v-col>

              <v-col  cols="12">
                <v-textarea 
                  v-if="existe == false"
                  v-model = "descripLarga"
                  outlined
                  dense
                  label="Descripción larga"
                >
                </v-textarea>
              </v-col>
              <v-col cols="12">
                <v-alert type="error" :value="alertaInput">
                  {{alerta}}
                </v-alert>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
             
    <!-- SNACK BAR -->
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
  </v-container>
</template>

<script>

  export default {
    data () {
      return {
        familias:[],
        familia: null,
        existe: true,
        subcategorias:[],
        subcategoria:null,
        categorias: [],
        categoria:null,

        snackbar: false,
        text:'',
        color:'',

        codigo:'',
        result2:'',
        nomart:'',
        sal:'',
        lab:'',

        alerta:'',
        alertaInput: false,

        descrip:'',

      }
    },

    created(){
      this.$http.get('familias.activo').then(response=>{
        this.familias = response.body
      }).catch(error=>{
        console.log('error',error)
      })
    },

    computed: {
      validaInfo(){
        return  this.nomart      !==  '' && 
                this.descrip     !==  '' &&       
                this.categoria   &&
                this.codigo      !==  '' 
      },
    },
      
    watch:{
      codigo(){
        if(this.codigo != ''){
          this.$http.get('articulos.codigo/'+ this.codigo).then(response=>{
            if(response.body.length > 0){
              this.existe = true
              this.text = 'Producto ya existente'
              this.snackbar = true
            }else{
              this.existe = false
            }
          }).catch(error=>{
            this.existe = false
            console.log('error',error)
          })
        }else{this.existe = true}
      },

      familia () {
        this.categorias = []
        if(this.familia){
          this.$http.get('categorias.familia/'+ this.familia.idfamilias).then(response=>{
            this.categorias = response.body
          }).catch(error=>{
            this.existe = false
            console.log('error',error)
          })
        }
      },

      categoria () {
        this.subcategorias = []
        if(this.categoria){
          this.$http.get('subcategorias.categoria/'+ this.categoria.idcategorias).then(response=>{
            this.subcategorias = response.body
          }).catch(error=>{
            this.existe = false
            console.log('error',error)
          })
        }
      }
    },

    methods:{

      agregar(){
        this.alerta = ''
        if(!this.validaInfo){
          if(!this.codigo){
            this.alerta = `No has asignado un codigo al articulo`
          }
          if(!this.nomart){
            this.alerta = this.alerta +`
            No has asignado un nombre al articulo`
          }
          if(!this.descrip){
            this.alerta = this.alerta +`
            No has asignado un compuesto  al articulo`
          }

          this.alertaInput = true
          console.log(this.validaInfo)
        }else{
          var payload = {
            nomart:           this.nomart,
            codigo:           this.codigo,
            descrip:          this.descrip,
            descripLarga:     this.descripLarga,
            idfamilias:       0,
            idcategorias:     0,
            idsubcategorias:  0,
          }

          if(this.familia){payload.idfamilias = this.familia.idfamilias}
          if(this.categoria){payload.idcategorias = this.categoria.idcategorias}
          if(this.subcategoria){payload.idsubcategorias = this.subcategoria.idsubcategorias}

          this.$http.post('articulos.add', payload).then(response=>{
            this.text  = 'Artículo agregado'
            this.snackbar = true
            setTimeout(() => (this.$router.push({name: 'catproductos'})), 1500)
          })
        }
      }
    }
  }
</script>