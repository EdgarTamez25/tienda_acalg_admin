<template>  
  <v-container>
    <v-row >  
      <v-col cols="12">
        <v-card>
          <v-card-title primary-title>
            Nueva Salida
            <v-spacer></v-spacer>
            <!-- BTN ATRAS -->
            <v-btn 
              small
              class="ma-2" 
              color="blue lighten-2" 
              :to="{name:'catsalidas'}" 
              dark>Atras
            </v-btn>

            <!-- BTN GUARDAR -->
            <v-btn 
              v-if="existe == false && todoOk == true"
              small 
              dark 
              class="ma-2" 
              @click.prevent="agregar"
              color="blue darken-3">Grabar
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="8" >
                <v-text-field
                  dense
                  clearable
                  label="Código"
                  v-model="codigo"
                  validate-on-blur
                  class="pa-0"  
                  outlined hide-details 
                ></v-text-field>
              </v-col>
              <v-col cols="4" align="center">
                <v-btn color="primary" rounded @click="openScan"><v-icon>search</v-icon></v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col  cols="12">
                <v-text-field
                  dense
                  v-if="existe ==  false"
                  readonly
                  label="Nombre del artículo"
                  v-model="nomart"
                  outlined 
                  hide-details 
                ></v-text-field>
              </v-col>
              <v-col  cols="6">
                <v-text-field
                  dense
                  v-if="existe ==  false"
                  label="Cantidad"
                  v-model="cant1"
                  outlined 
                  hide-details 
                  type="number" 
                ></v-text-field>
              </v-col>
              <v-col  cols="6">
                <v-text-field
                  dense
                  v-if="existe ==  false"
                  label="Confirmar"
                  v-model="cant2"
                  outlined 
                  hide-details 
                  type="number" 
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-data-table
                  v-if="existe ==  false && cant1 == cant2 && cant1 != '' && cant2 != ''"
                  :loading="loading"        
                  :headers="headers"
                  :items="productos"
                  class="elevation-1"
                  hide-default-footer
                  loading-text="Cargando..."
                  dense
                  :search="search"
                  :items-per-page="longitud"
                  :mobile-breakpoint="200"
                  item-key="idalmacen"
                  
                >
                  <template v-slot:item.salida="props">
                    <v-edit-dialog
                      :return-value.sync="props.item.salida"
                      @save="save"
                      @cancel="cancel"
                      @open="open"
                      @close="close"
                    > {{ props.item.salida }}
                      <template v-slot:input>
                        <v-text-field
                          v-model="props.item.salida"
                          label="Cantidad"
                          single-line
                          counter
                          type="number"
                        ></v-text-field>
                      </template>
                    </v-edit-dialog>
                  </template>

                  <!-- STATUSWEB -->
                  <template v-slot:no-data>
                    <v-alert type="info" color="primary" outlined :value="true">
                      No hay datos para mostrar
                    </v-alert>
                  </template>
                </v-data-table>
              </v-col>
              <v-col  cols="12" xl="6" lg="6" md="6" sm="6" xs="12">
                <v-text-field
                  dense
                  v-if="existe ==  false "
                  label="Recibió"
                  v-model="recibio"
                  outlined 
                  hide-details 
                ></v-text-field>
              </v-col>
              <v-col cols="12" xl="6" lg="6" md="6" sm="6" xs="12">
                <v-menu
                  dense
                  v-if="existe ==  false"
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  :return-value.sync="fecha"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      dense
                      v-model="fecha"
                      label="Fecha de Salida"
                      prepend-icon="event"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="fecha" no-title scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                    <v-btn text color="primary" @click="$refs.menu.save(fecha)">OK</v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12">
                <v-alert type="error" :value="alertaInput">
                  {{alerta}}
                </v-alert>
              </v-col>
            </v-row>
            
          </v-card-text>
          <!-- TOOLBAR -->
          
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

  import {mapGetters} from 'vuex'

  export default {
    data () {
      return {
        todoOk: false,

        existe: true,
        snackbar: false,
        text:'',
        color:'',

        almacen:[],

        codigo:'',
        result2:'',
        nomart:'',
        cant1:'',
        cant2:'',
        recibio:'',
        fecha: new Date().toISOString().substr(0, 10),
        menu: false,

        alerta:'',
        alertaInput: false,


        loading: true,
        longitud:5,
        page: 1,
        pageCount: 0,
        itemsPerPage: 10,
        search:'',
        productos:[],
        headers: [
          { text: 'Nombre', align: 'left',sortable: false, value: 'nomart'},
          { text: 'Cantidad', value: 'cant' },
          { text: 'Caducidad', value: 'caducidad' },
          { text: 'Lote', value: 'lote' },
          { text: 'Salida', value: 'salida' },

        ],
      }
    },

    created(){
      if(this.getdatosUsuario.idusuariosweb == undefined){
        this.color = 'error'
        this.text = 'Debes iniciar sesión primero'
        this.snackbar = true
        this.$router.push({name:'login'}).catch(error=>{
          console.log(error)
        })
      }
    },


    computed: {
      ...mapGetters('Login', ['getdatosUsuario', 'getLogeado']),

      validaInfo(){
        return  this.codigo    !==  '' && 
                this.recibio   !==  '' &&
                this.recibio   !==  '' &&
                this.cant1     ===  this.cant2
      },
    },

    watch:{
      codigo(){
        this.$http.get('articulos.codigo/' + this.codigo).then(response =>{
          if(response.body.length > 0){
            this.codigo2 = response.body[0].codigo
            this.nomart = response.body[0].nomart
            this.existe = false
            this.existencias()
          }else{
            this.text = 'No existe el articulo'
            this.snackbar = true
            this.existe = true
          }
          console.log(response.body)
        }).catch(error =>{
          this.text = 'No existe el articulo'
          this.snackbar = true
          console.log('error', error.status)
        })
      }
    },

    methods:{

      openScan(){

        cordova.plugins.barcodeScanner.scan(result=>{
          this.codigo = result.text
        },error=>{
          alert("Scanning failed: " + error);
        })

        cordova.plugins.barcodeScanner.encode(BarcodeScanner.Encode.TEXT_TYPE, "http://www.nytimes.com", success =>{
          alert("encode success: " + success);
        }, fail=>{
          alert("encoding failed: " + fail);
        })
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

      agregar(){
        if(this.getdatosUsuario.idusuariosweb == undefined){
          this.color = 'error'
          this.text = 'Debes iniciar sesión primero'
          this.snackbar = true
        }else{

          this.alerta = ''
          if(!this.validaInfo){
            if(this.codigo == ''){
              this.alerta = `No has escaneado ningun artículo`
            }
            if(this.recibio == ''){
              this.alerta = this.alerta +`
              ¿Quien recibió?`
            }
            if(this.cant1 == ''){
              this.alerta = this.alerta +`
              Asigna una catidad de salida`
            }
            if(this.cant2 == ''){
              this.alerta = this.alerta +`
              Confirma la cantidad de salida`
            }
            if(this.cant1 != this.cant2){
              this.alerta = this.alerta +`
              No concuerdan las cantidades`
            }

            this.alertaInput = true
            console.log(this.validaInfo)
          }else{
            this.verificarExistencias()
          }
        }
      },

      verificarExistencias(){
        this.$http.get('existencias.codigo/'+ this.codigo2).then(response=>{
          this.almacen = response.body
          console.log(this.almacen)
          var suma = 0
          if(this.almacen.length > 0){
            for (var i = this.almacen.length - 1; i >= 0; i--) {
              suma = suma + parseInt(this.almacen[i].cant)
            }

            console.log(suma)
            if(this.cant1 > suma){
              this.text = 'No hay existencias suficientes'
              this.snackbar = true
            }else{
              // Restar existencias 
              this.eliminaAlmacen()
            }

          }else{
            this.text = 'No hay existencias'
            this.snackbar = true
          }
        })
      },

      eliminaAlmacen(){ 
        this.productos.forEach((element) =>{
          if(element.salida != undefined){
            var payload = {cant: element.cant - element.salida}
            this.$http.put('almacen.update/' + element.idalmacen , payload).then(response=>{
              element.caducidad = element.caducidad.substr(0,10)
              this.agregarSalida(element.salida, element.lote, element.caducidad )
              console.log('response', response)
              setTimeout(() => (this.$router.push({name: 'catsalidas'})), 1500)
            })
          }
        })
      },

      agregarSalida(cant, lote, caducidad){
        var payloadSalida = {
          codigo:    this.codigo2,
          lote:      lote,
          caducidad: caducidad,
          cant:      cant,
          recibio:   this.recibio,
          fecha:     this.fecha,
          entrego:   this.getdatosUsuario.idusuariosweb
        }
        console.log(payloadSalida)

        this.$http.post('salidas.add', payloadSalida).then(response=>{
          console.log(response.body)
        })
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

        console.log(this.productos)
        var suma = 0
        this.productos.forEach((element, index)=>{
          console.log(element)
          if(element.salida != undefined){
            if(element.salida > parseInt(element.cant)){
              element.salida = parseInt(element.cant)
            }
            suma = suma + parseInt(element.salida)
          }


          if(index == this.productos.length - 1){
            console.log('suma: ',suma)

            if(suma < this.cant1){
              this.snackbar = false
              this.text = 'Faltan: ' +  (this.cant1 - suma)
              this.snackbar = true 
            }

            if(suma > this.cant1){
              this.snackbar = false
              this.text = 'Sobra: ' +  (suma - this.cant1 )
              this.snackbar = true 
            }

            if(suma == this.cant1){
              this.todoOk = true
            }
            console.log('Dialog closed')
          }
        })

      },

    },
  }

</script>