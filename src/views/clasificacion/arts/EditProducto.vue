<template>  
  <v-container>
    <v-divider></v-divider>
    <v-card class="elevation-0">
      <v-tabs
        dense
        class="mt-4"
        v-model="tab"
        background-color="white"
      >
        <v-tabs-slider color="primary"></v-tabs-slider>

        <v-tab
          v-for="(item,i) in items"
          :key="i"
        >
          <v-icon v-text="item.icon" left></v-icon>{{ item.name }}
        </v-tab>
      </v-tabs>
    </v-card>
    <v-row>
      <v-col cols="12">
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-col cols="12" lg="8">
              <v-card class="elevation-0">
                <v-card-title primary-title class="pt-0">
                  Editar Artículo
                  <v-spacer></v-spacer>
                  <v-btn 
                    small
                    class="ma-2" 
                    color="secondary" 
                    :to="{name:'catproductos'}" 
                    dark>Atras
                  </v-btn>
                  <!-- BTN GUARDAR -->
                  <v-btn 
                    small 
                    dark 
                    class="ma-2" 
                    @click.prevent="update"
                    color="primary">Grabar
                  </v-btn>
                </v-card-title>
                <v-card-text>
                  <v-text-field
                    readonly
                    label="Código"
                    v-model="articulo.codigo"
                    validate-on-blur
                    class="pa-0"  
                    dense
                    outlined
                  ></v-text-field>

                  <v-switch 
                    v-model="articulo.estatus" 
                    label="Activo en tienda" 
                  ></v-switch>
                  
                  <v-text-field
                    label="Nombre del artículo"
                    v-model="articulo.nomart"
                    outlined 
                    dense
                  ></v-text-field>

                  <v-select 
                    dense
                    outlined
                    :items="familias"
                    v-model="familia"
                    item-text="familia"
                    item-value="idfamilia" 
                    label="Familia"
                    persistent-hint
                    return-object
                  ></v-select>

                  <v-select 
                    dense
                    outlined
                    :items="categorias"
                    v-model="categoria"
                    item-text="categoria"
                    item-value="idcategorias" 
                    label="Categoria"
                    persistent-hint
                    return-object
                  ></v-select>

                  <v-select 
                    dense
                    outlined
                    :items="subcategorias"
                    v-model="subcategoria"
                    item-text="subcategoria"
                    item-value="idsubcategorias" 
                    label="Subcategoria"
                    persistent-hint
                    return-object
                  ></v-select>

                  <v-textarea
                    label="Descripción corta"
                    v-model="articulo.descrip"
                    outlined 
                    auto-grow
                  >
                  </v-textarea>

                  <v-textarea
                    label="Descripción Larga"
                    v-model="articulo.descripLarga"
                    outlined 
                    auto-grow
                  >
                  </v-textarea>
                    
                  <v-alert type="error" :value="alertaInput">
                    {{alerta}}
                  </v-alert>
                </v-card-text>
              </v-card>
            </v-col>
          </v-tab-item>

          <v-tab-item>
            <v-col cols="12" lg="8">
              <v-card class="elevation-0">
                <v-card-title primary-title>
                  Sube tus imagenes masivamente
                  <v-spacer></v-spacer>
                  <v-btn 
                    small
                    class="ma-2" 
                    color="secondary" 
                    :to="{name:'catproductos'}" 
                    dark>Atras
                  </v-btn>
                  <v-btn color="primary" small @click="subirFotos()">Subir Fotos</v-btn>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                  <v-file-input
                    outlined
                    dense
                    small-chips
                    multiple
                    v-model="files"
                    accept="image/png, image/jpeg, image/bmp"
                    placeholder="Selecciona tus imagenes"
                    prepend-icon="mdi-camera"
                    label="Imágenes"
                    @change="cargar()"
                  ></v-file-input>
                </v-card-text>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" xl="4" lg="4" md="4" sm="5" xs="6" v-for="(img, i) in vistaPrevias" :key="i">
                      <v-card class="py-2">
                        <v-img :src="img.url" contain aspect-ratio="2">
                          <v-row align="end" class="lightbox white--text pa-2 fill-height">
                            <v-col align="right">
                              <v-btn color="error" samll @click="eliminarFoto(img.url)" icon><v-icon>delete</v-icon></v-btn>
                            </v-col>
                          </v-row>
                        </v-img>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

              <v-card class="elevation-0">
                <v-card-title primary-title>
                  Imágenes actuales
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" xl="4" lg="4" md="4" sm="5" xs="6" v-for="(f, i) in fotos" :key="i">
                      <v-card height="100%">
                        <v-img :src="url + f.image_name" contain height="150"/>
                        <v-card-actions>
                          <v-btn icon color="error" @click="deleteFoto(f.idfotos)"><v-icon>delete</v-icon></v-btn>
                          <v-spacer></v-spacer>
                          <v-checkbox label="Principal" v-model="f.principal" @click="updateEestatus(f.idfotos)"></v-checkbox>
                        </v-card-actions>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-tab-item>

          <v-tab-item>
            <v-card class="elevation-0">
              <v-card-title primary-title>
                Precio del artículo 
                <v-spacer></v-spacer>
                <v-btn 
                    small
                    class="ma-2" 
                    color="secondary" 
                    :to="{name:'catproductos'}" 
                    dark>Atras
                  </v-btn>
                <v-btn color="primary" @click="update" small>Actualizar</v-btn>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12" xl="3" lg="3" md="4" sm="4" xs="6">
                    <v-text-field
                      label="Precio"
                      v-model = "articulo.precio1"
                      type="number"
                      prefix="$"
                      suffix="MXN"
                      outlined
                      dense
                    ></v-text-field>

                    <v-text-field
                      label="% Descuento"
                      v-model = "articulo.pjedesc"
                      type="number"
                      prefix="%"
                      @change="calcularDescuento()"
                      outlined
                      dense
                    ></v-text-field>

                    <v-text-field
                      v-model="preciowithdescuento"
                      label="Precio con descuento"
                      prefix="$"
                      suffix="MXN"
                      outlined
                      readonly
                      dense
                    ></v-text-field>

                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
    <v-row >  

      
    </v-row>
        <!-- TOOLBAR -->
             
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
  import {mapGetters} from 'vuex'
  export default {
    data () {
      return {
        id: 0,
        statusweb: false,
        producto:{},
        articulo:{},

        tab: {name:'Información'            , icon:'insert_drive_file' }, 
        items: [
          {name:'Información'      , icon:'insert_drive_file' }, 
          {name:'Imágemes'         , icon:'insert_drive_file' }, 
          {name:'Precios'          , icon:'assignment' }, 
        ],

        familias:[],
        familia:null,

        existe: true,

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

        categorias:[],
        categoria:null,

        familias:[],
        familia:null,

        subcategorias:[],
        subcategoria:null,

        preciowithdescuento:0,

        url:'',
        fotos:[],
        rules: [
          value => !value ,
        ],
        files: [],
        vistaPrevias:[],
      }
    },


    computed: {
      ...mapGetters('productos',['getProducto']),
      validaInfo(){
        return  this.nomart      !==  '' && 
                this.sal         !==  '' &&       
                this.laboratorio.idlaboratorios         !==  '' 
      },
    },

    watch:{
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
      },

    },

    created(){
      var url2 = this.$http.options.root + 'fotos/'
      this.url = url2
      this.fotos = this.getProducto.fotos
      
      this.codigo = this.getProducto.codigo

      this.id = this.getProducto.id

      // this.lab = this.getProducto.lab
      this.$http.get('articulos.id/' + this.id).then(response=>{
        this.articulo = response.body
        this.familia      = {idfamilias:      this.articulo.idfamilias,      familia:      this.articulo.familia}
        this.categoria    = {idcategorias:    this.articulo.idcategorias,    categoria:    this.articulo.categoria}
        this.subcategoria = {idsubcategorias: this.articulo.idsubcategorias, subcategoria: this.articulo.subcategoria}

        // Cargar las fotos
        this.$http.get('articulos.fotos/' + this.articulo.codigo).then(response=>{
          if(response.data.length > 0){
            this.fotos = response.data
            this.fotos.forEach((element)=>{
              element.principal = !! +element.principal
            })
          }
        }).catch(error=>{console.log(error)})

        // Obtener todo de las categorias y familias y todoo jaja
        // las familias es general
        this.$http.get('familias.activo').then(response=>{
          this.familias = response.body
          // aquí solo se deben consultar las de esa familia
          this.$http.get('categorias.familia/'+ this.articulo.idfamilias).then(response=>{
            this.categorias = response.body
            // y ahora a llenar las subcategorias
            if(this.articulo.idsubcategorias != 'NA'){
              this.$http.get('subcategorias.categoria/'+ this.articulo.idsubcategorias).then(response=>{
                this.subcategorias = response.body
              }).catch(error=>{
                this.existe = false
                console.log('error',error)
              })
            }
          }).catch(error=>{
            this.existe = false
            console.log('error',error)
          })

        }).catch(error=>{
          console.log('error',error)
        })
      }).catch(error=>{
        console.log('error',error)
      })

    },

    methods:{
      update(){
        if(this.familia){      this.articulo.idfamilias =      this.familia.idfamilias}
        if(this.categoria){    this.articulo.idcategorias =    this.categoria.idcategorias}
        if(this.subcategoria){ this.articulo.idsubcategorias = this.subcategoria.idcategorias}

        if(this.articulo.estatus == true){
          this.articulo.estatus = 1
        }else{
          this.articulo.estatus = 0
        }

        this.$http.put('articulos.update/'+ this.id, this.articulo).then(response=>{
          this.text  = 'Artículo actualizado'
          this.snackbar = true
          this.color = 'success'
        }).catch(error=>{console.log(error)})

      },

      calcularDescuento(){
        if(this.articulo.pjedesc > 0){
          this.preciowithdescuento = ((100 - this.articulo.pjedesc)/100) * this.articulo.precio1
        }else{
          this.preciowithdescuento = 0
        }
      },

      cargarFotos(){
        var url2 = this.$http.options.root + 'fotos/'
        this.url = url2
        this.fotos = []
        this.$http.get('articulos.fotos/' + this.articulo.codigo).then(response=>{
          if(response.data.length > 0){
            this.fotos = response.data
            this.fotos.forEach((element)=>{
              element.principal = !! +element.principal
            })
          }
        }).catch(error=>{console.log(error)})
      },

      cargar(){
        if(this.files.length < 1){
          return
        }

        this.files.forEach((element, index) => {
          // creamos una variable tipo FormData
          let formData = new FormData();
          //se crea el objeto y se le agrega como un apendice el archivo 
          formData.append('file', element);
          //mandamos a ocvertir la imagen a base64 pero mandamos el docuemnto, el formdata, el nombre
          this.getBase64(element, formData)
        })
      },

      getBase64(file, formData) {
        var me = this
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          me.vistaPrevias.push({
            url: reader.result, 
            formData: formData, 
            image_name: file.name
          })
        };
      },

      subirFotos(){
        // Recorremos las imagenes previas cargadas para poder agregarlas al servidor y guardar el nombre en la base de datos
        this.vistaPrevias.forEach((element, index) => {
          var payload = {
            codigo: this.articulo.codigo,
            image_name: element.image_name,
            principal: 0
          }
          this.$http.post('fotos.add', payload).then(response=>{
            // Mandamos el formdata (archivo de la imagen) al servidor
            this.$http.post('imagenes', element.formData).then(response=>{
              //  y se gguar tambien en la base de datos, solo se guarda el nombre de la imagen
              if(index == 0){
                this.text  = 'Artículo actualizado'
                this.snackbar = true
                this.color = 'success'
                // Limpiamos las imagenes previas ya cuando se haya terminado el recorrido del foreach
                this.vistaPrevias = []
                this.files = []
                this.cargarFotos()
              }
            }).catch(error=>{console.log(error)})
          }).catch(error=>{console.log(error)})
        })

      },

      eliminarFoto(value){
        this.vistaPrevias.forEach((element, index)=>{
          if(element.url == value){
            this.vistaPrevias.splice(index,1);
          }
        })
      },

      deleteFoto(value){
        this.$http.delete('admin/foto.art.delete/' + value).then(response=>{
          this.cargarFotos()
        }).catch(error=>{console.log(error)})
      },

      updateEestatus(id){
        this.fotos.forEach((element,index)=>{
          if(element.idfotos == id){
            element.principal = 1
          }else{
            element.principal = 0
          }
          this.$http.put('update.foto.principal/' + element.idfotos, element).then(response=>{
          }).catch(error=>{console.log(error)})
          

          if(index == this.fotos.length - 1){
            this.cargarFotos()
          }
        })
      }
    }

  }

</script>