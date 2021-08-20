 <template>
                 
          <!-- FORMA MODAL -->
          <v-card>
            <v-toolbar  dark>
              <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn color="info"  class="ma-2" dark @click="close">Cancel</v-btn>          
                <v-btn color="blue darken-1"  class="ma-2" dark @click="save">Grabar</v-btn>
            </v-toolbar>      
            
            <v-container>    
              <v-card-text>
                <v-row>
                  
                  <v-col  v-show="Mostrar" cols="2" sm="2" md="2">
                    <v-text-field 
                      readonly  hide-details 
                      v-model="idusuariosweb" label="ID"></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="10" md="10">
                    <v-text-field 
                      autofocus 
                      v-model="Nomuser"
                      :rules="NomlinRules"
                      :counter="30"
                      label="Usuario"

                      required hide-details 
                    ></v-text-field>
                  </v-col>
                </v-row>
                
                <v-row>
                  <v-col cols="6" sm="6" md="6">   
                    <!-- EMAIL -->
                    <v-text-field
                      autofocus
                      v-model="Email" 
                      prepend-icon="email" 
                      label="Correo" 
                      required
                      type="text">
                    </v-text-field>

                      <!-- PASSWORD -->
                    <v-text-field
                      v-model="password"
                      prepend-icon="lock"
                      :append-icon="show1 ? 'visibility' : 'visibility_off'"
                      :rules="[rules.required, rules.min]"
                      :type="show1 ? 'text' : 'password'"
                      label="contraseña"
                      hint="At least 8 characters"
                      counter
                      @click:append="show1 = !show1"
                    ></v-text-field>

                  </v-col>
                  
              
                  <v-col cols="6" sm="6" md="6">
                  
                    <v-autocomplete
                      @keyup.enter="submit"
                      label="Selecciona un cliente y oprime ENTER"
                      v-model="Nomcli"
                      :items="clientesArr"
                      clearable
                      append-icon="search"
                      @input="evento(Nomcli)"
                    ></v-autocomplete>


                  <!-- SELECCIONAR Vendedor -->
                    <v-autocomplete
                      @keyup.enter="busvend"
                      label="Buscar un vendedor y oprimir ENTER"
                      v-model="Nomvend"
                      :items="vendArr"
                      clearable
                      append-icon="search"
                      @input="inputvend(Nomvend)"
                    ></v-autocomplete>           
            
                  
                  </v-col>
                    
                </v-row>
              </v-card-text>
            </v-container>
          </v-card>
</template>


<script>
var accounting = require("accounting");
var md5     = require('md5')

  export default {

    data: () => ({
      dialog: false,
      headers: [
          { text: 'ID', align: 'left',sortable: false, value: 'idusuariosweb' },
          { text: 'Usuario'  , value: 'Nomuser' },
          { text: 'Email'    , value: 'Email' },
          { text: 'Cliente'  , value: 'numcli' },
          { text: 'Nombre Cliente'  , value: 'Nomcli' },
          { text: 'id Vend'  , value: 'idvend' },
          { text: 'Vendedor', value: 'Nomvend'},
          { text: 'Nivel', value: 'nivel'},
          { text: 'Actions' , value: 'action', sortable: false },
      ],

      Mostrar : false,
      search: '',
      editedIndex: -1,
      loading: false,
        
      usuarios: [],
      idusuariosweb:'',
      Nomuser: '',
      Email:'',
      numcli:'',
      Nomcli: '',
      idvend:'',
      Nomvend:'',
      nivel:'',
      password:'',

      vendedores:[],
      clientes:[],
      usuariostemp:[],


      rules: {
          required: value => !!value || 'Requerido.',
          min: v => v.length >= 8 || 'Minimo 8 caracteres',
          emailMatch: () => ('El correo y/o la contraseña no son correctos')
        },
      show1: false,
      error: '',
      color:'', 


      //// Buscar CLIENTE
      cliente:'',
      clientesArr:[],
      clientesAll:[],
      idweb:'',
      Numcli:'',

      // BUSCAR VENDEODR
      vend:'',
      vendArr:[],
      vendAll:[],
      idvend:'',
      
      NomlinRules: [
      v => !!v || 'El nombre es requerido',
      v => v.length <= 30 || 'El nombre debe ser menor de 30 letras',
      ],
      NumlinRules: [
        v => !!v || 'La clave de la Línea es requerida.',       
      ],
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nuevo Usuario' : 'Editar Usuario'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },

    },

    created () {
      this.init()
    },

    methods: {
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

      // FORMATO PDF
      crearPDF() {
        var columns = [

            { title: 'ID',               dataKey: 'idusuariosweb' },
            { title: 'Usuario'  ,        dataKey: 'Nomuser' },
            { title: 'Email'    ,        dataKey: 'Email' },
            { title: 'Cliente'  ,        dataKey: 'numcli' },
            { title: 'Nombre Cliente'  , dataKey: 'Nomcli' },
            { title: 'ID Vend'  ,        dataKey: 'idvend' },
            { title: 'Vendedor',         dataKey: 'Nomvend'},
            { title: 'Nivel',            dataKey: 'nivel'},
        ];

        var doc = new jsPDF('p','pt');
        doc.autoTable(columns, this.usuarios, {
            styles: {minCellWidth: 60, halign: 'left'},
            columnStyles: {
              0: {cellWidth: 'auto'},
              1: {cellWidth: 'auto'},
              2: {cellWidth: 90},
              3: {cellWidth: 'auto'},
              4: {cellWidth: 'auto'},
              5: {cellWidth: 'auto'},
              6: {cellWidth: 'auto'},
              7: {cellWidth: 'auto'},
              },
            margin: {top: 60},
            didDrawPage: function(data) {
              doc.text("Catálogo de Usuarios", 40, 30);
          }
        });
        doc.save('Usuarios.pdf');
      },

       //BUSCAR 
      submit(){
        this.clientesArr = []
        this.clientesAll = []
        var payload = { Buscacli : this.cliente}

          console.log(payload)
        this.$http.post('auth/api/v1/clientes.find',payload).then(response=>{
          this.clientesAll = response.body
          console.log(this.clientesAll)
          for (var i = response.body.length - 1; i >= 0; i--) {

            this.clientesArr.push(response.body[i].nomcli)
          }
        })
      },

      evento(valor){
        for (var i = this.clientesAll.length - 1; i >= 0; i--) {
          if(this.clientesAll[i].nomcli === valor){
            
            this.idweb = this.clientesAll[i].idweb
            this.Numcli = this.clientesAll[i].Numcli
              console.log(valor +'  ' + this.idweb + ' ' + this.Numcli )          
          }
        }
      },


      //BUSCAR VENDEDOR 
      busvend(){
        this.vendArr = []
        this.vendAll = []
        var payload = { Buscavend : this.vendedor}

          console.log(payload)
        this.$http.post('auth/api/v1/vendedores.find',payload).then(response=>{
          this.vendAll = response.body
          console.log(this.vendAll)
          for (var i = response.body.length - 1; i >= 0; i--) {
            this.vendArr.push(response.body[i].Nomvend)
          }
        })
      },

      inputvend(valor){
        for (var i = this.vendAll.length - 1; i >= 0; i--) {
          if(this.vendAll[i].Nomvend === valor){
            
            this.idvend = this.vendAll[i].IDvend
            console.log(valor +'   '+ this.idvend)          
          }
        }
      },


      init () {
        this.clientesArr = []
        this.vendArr = []
        // r.GET("/tienda3/api/v1/clientes",    controllers.ListClientes)

        //Consultar Usuarios
        this.loading = true

        this.$http.get('auth/api/v1/usuarios.list').then( response => {
          this.usuariostemp = response.body
          //Cargar vendedores
          this.$http.get('auth/api/v1/vend.list').then( response => {
            this.vendedores = response.body
            for (var i = this.vendedores.length - 1; i >= 0; i--) {
              this.vendArr.push(this.vendedores[i].Nomvend)
            }
            //Cargar clientes
            this.$http.get('api/v1/clientes').then( response => {
              this.clientes = response.body
              for (var i = this.clientes.length - 1; i >= 0; i--) {
                this.clientesArr.push(this.clientes[i].nomcli)
              }
              this.LlenaVendCli()
            })
          })
      
        }).catch(error => {
          console.log(error)
        }).finally(()  => this.loading = false) 

      },  

      LlenaVendCli(){
        for (var i = this.usuariostemp.length - 1; i >= 0; i--) {
          for (var j = this.vendedores.length - 1; j >= 0; j--) {
            if(this.usuariostemp[i].idvend == 0){
              this.usuariostemp[i].idvend = ''
            }
            if(this.vendedores[j].IDvend == this.usuariostemp[i].idvend){
              this.usuariostemp[i].Nomvend = this.vendedores[j].Nomvend
            }
            if(this.usuariostemp[i].Nomvend == undefined){
              this.usuariostemp[i].Nomvend = ''
            }
          }            
        }

        for (var i = this.usuariostemp.length - 1; i >= 0; i--) {
          for (var j = this.clientes.length - 1; j >= 0; j--) {
            if(this.clientes[j].numcli == this.usuariostemp[i].numcli){
              this.usuariostemp[i].Nomcli = this.clientes[j].nomcli
            }
            if(this.clientes[j].idweb == this.usuariostemp[i].numcli){
              this.usuariostemp[i].Nomcli = this.clientes[j].nomcli
            }
            if(this.usuariostemp[i].Nomcli == undefined){
              this.usuariostemp[i].Nomcli = ''
            }
          }            
        }
        this.usuarios = this.usuariostemp
      },  
    

      //CARGAR INFO
      cargarinfo (item) {
        console.log(item)
        this.editedIndex = this.usuarios.indexOf(item)
        // this.editedItem = Object.assign({}, item)


        this.editItem = item 
        // console.log(this.editedItem.Id)
        this.Mostrar = true
        this.dialog = true
     
        //Pasar datos de item al objeto
        this.idusuariosweb = item.idusuariosweb
        this.Nomuser   = item.Nomuser

        this.Email     = item.Email
        this.password  = item.password

        this.idvend    = this.idvend
        this.Numcli    = this.Numcli

        this.Nomvend   = item.Nomvend
        this.Nomcli   = item.Nomcli

      },

      deleteItem (item) {
        // console.log(item)
        var nId = item.idusuariosweb
        console.log (nId)
        this.$http.delete('auth/api/v1/usuarios.delete/' + nId).then( response => {
        }).catch(error => {
          console.log(error)
        }).finally(()  => {
          this.init() 
          // this.loading = false
        }) 
      },


      //Cierra Ventana Modal y limpia el objeto a Editar. 
      close () {
        this.Mostrar= false
        this.dialog = false

        //Pasar datos de item al objeto
        this.idusuariosweb = ''
        this.Nomuser   = ''

        this.Email     = ''
        this.password  = ''

        this.idvend    = ''
        this.Nomvend    = ''
        this.Nomcli    = ''


        //SELECTORIS

        //// Buscar CLIENTE
        this.cliente=''
        // this.clientesArr=[]
        this.clientesAll=[]
        this.idweb= ''

        // BUSCAR VENDEODR
        this.vend  =  ''
        // this.vendArr =[]
        this.vendAll =[]
        this.idvend =''

        setTimeout(() => {
          // this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)


      },

      save () {
        console.log('Entre al save')
        console.log('nomcli', this.clientes)
        console.log('Nomvend', this.vendedores)

        //Checar este codigo
        for (var i = this.clientes.length - 1; i >= 0; i--) {
          if(this.clientes[i].nomcli == this.Nomcli){
            this.Numcli = this.clientes[i].idweb
          }

          if(this.clientes[i].nomcli == this.Nomcli){
            this.Numcli = this.clientes[i].numcli
          }

        }

        for (var j = this.vendedores.length - 1; j >= 0; j--) {
          if(this.vendedores[j].Nomvend == this.Nomvend){
            this.idvend = this.vendedores[j].IDvend
          }
        }

        for (var i = this.vendedores.length - 1; i >= 0; i--) {
          if(this.vendedores[i].Nomvend == this.Nomvend){
            this.idvend = this.vendedores[i].Numvend
          }
        }
        //CONVERTIR a 0 y 1
        // var nstatus = +this.statusweb
        
        var cPassword= md5(this.password)

        var payload = {
          idusuariosweb : this.idusuariosweb,
          Nomuser  : this.Nomuser,
          Email    : this.Email,
          password : cPassword,
          Numcli : this.Numcli,
          Idvend : this.idvend,
          Nivel  : "ADMIN",
          Idnivel: '3'
     
        }
     
        this.loading = true
        console.log('datos a guardar',payload)
     
        // Si ES UNA LINEA Actual 
        if (this.idusuariosweb !== '' ) {
          
            console.log ("UPDATE", payload)
            this.$http.put('auth/api/v1/usuarios.update/' + nIdLinea, payload).then( response => {
              console.log('Linea.insert', response.body)
            }).catch(error => {
              console.log(error)
            }).finally(()  => {
              this.init() 
               this.loading = false
            }) 
    
        // SI es un vendedor Nuevo. //API POST
        }else{
          this.$http.post('auth/api/v1/usuarios.add', payload).then( response => {
            console.log('usuarios insert', response.body)
            this.getId(payload.Email)
          }).catch(error => {
            console.log(error.body)
          }).finally(()  => {
            this.init() 
             this.loading = false
          }) 
        }
        this.close()
      },

      getId(correo){
        console.log(correo)
        const formData = {
          Email: correo
        }

        return new Promise((resolve, reject) => {
          
          this.$http.post('api/v1/getidxmail', formData) .then(respuesta=>{return respuesta.json()})
          
          .then(respuestaJson=>{
            if(respuestaJson === null){
              resolve(false)
              // this.snackbar= true ; this.text="No encontre ID" ; this.timeout=3000
            }else{
              console.log(respuestaJson)
              respuestaJson.Email = correo
              this.enviarCorreo(respuestaJson)
              // dispatch('enviarCorreo' ,this.ID)
              resolve(true)
            }

            }).catch(function(error){console.log('error',error)})
          })
      },

      enviarCorreo(item){
        var me = this
        var id = item 
        
        const  formData = { Email: item.Email, Iduser: item.idusuariosweb }
   
        this.$http.post('api/v1/activarcuenta', formData).then(function(response){
          // console.log('correo',response)
        })
      },


    },



       filterOnlyCapsText (value, search, item) {
        return value != null &&
          search != null &&
          typeof value === 'string' &&
          value.toString().toLocaleUpperCase().indexOf(search) !== -1
      },

  }
</script>