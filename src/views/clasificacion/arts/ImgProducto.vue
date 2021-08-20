<template>
	<v-container>
		<v-card class="elevation-0">
			<v-card-title primary-title>
			  Imágenes actuales
			</v-card-title>
			<v-card-text>
			  <v-row>
			  	<v-col cols="12" xl="3" lg="3" md="4" sm="4" xs="6" v-for="(f, i) in fotos" :key="i">
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

		<v-card class="elevation-0">
			<v-card-title primary-title>
			  Sube tus imagenes masivamente
			  <v-spacer></v-spacer>
			  <v-btn color="success" @click="subirFotos()">Subir Fotos</v-btn>
			</v-card-title>
			<v-divider></v-divider>
			<v-card-text>
        <v-file-input
          small-chips
          multiple
          v-model="files"
          :rules="rules"
          accept="image/png, image/jpeg, image/bmp"
          placeholder="Selecciona tus imagenes"
          prepend-icon="mdi-camera"
          label="Imágenes"
          @change="cargar()"
        ></v-file-input>
			</v-card-text>
			<v-card-text>
		    <v-row>
		      <v-col cols="12" xl="2" lg="2" md="3" sm="4" xs="6" v-for="(img, i) in vistaPrevias" :key="i">
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
	</v-container>
</template>
<script>
  import {mapGetters, mapActions} from 'vuex'
  export default {
    data () {
      return {
      	url:'',
        fotos:[],
        rules: [
          value => !value ,
        ],
        files: [],
        vistaPrevias:[],

      }
    },

    created(){
      var url2 = this.$http.options.root + 'fotos/'
      this.url = url2
      this.fotos = this.getProducto.fotos
      
    	this.codigo = this.getProducto.codigo
    },

    methods:{
    	cargarFotos(){
    		var url2 = this.$http.options.root + 'fotos/'
    		this.url = url2
    		this.fotos = []
    		this.$http.get('articulos.fotos/' + this.codigo).then(response=>{
    			console.log(response.data.length)
    			if(response.data.length > 0){
    				this.fotos = response.data
    				this.fotos.forEach((element)=>{
    					element.principal = !! +element.principal
    				})
    			}
    			console.log(this.fotos)
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
        	console.log(file)
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
        	console.log('foto: ',element)
        	var payload = {
            codigo: this.codigo,
        		image_name: element.image_name,
        		principal: 0
        	}
      		this.$http.post('fotos.add', payload).then(response=>{
	          // Mandamos el formdata (archivo de la imagen) al servidor
	          this.$http.post('imagenes', element.formData).then(response=>{
	            //  y se gguar tambien en la base de datos, solo se guarda el nombre de la imagen
	            if(index == 0){
	              this.text = 'Fotos cargadas exitosamente'
	              this.snackbar =  false
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
      	console.log(this.vistaPrevias)
      	this.vistaPrevias.forEach((element, index)=>{
      		if(element.url == value){
      			console.log('mi index a eliminar',index)
      			this.vistaPrevias.splice(index,1);
      		}
      	})
      },

      deleteFoto(value){
        this.$http.delete('admin/foto.art.delete/' + value).then(response=>{
          console.log(response)
          this.cargarFotos()
        }).catch(error=>{console.log(error)})
      },

      updateEestatus(id){
      	this.fotos.forEach((element)=>{
      		if(element.idfotos == id){
      			element.principal = true
      		}else{
      			element.principal = false
      		}
      	})

      	var temp = this.fotos
      	temp.forEach((element)=>{
      		if(element.principal ==true){
      			element.principal = 1
      		}else{
      			element.principal = 0
      		}

      		this.$http.put('v1/fotosxart/' + element.idfotos, element).then(response=>{
          console.log(response)
          this.cargarFotos()
        }).catch(error=>{console.log(error)})
      	})

      }
     
    },

    computed: {
      ...mapGetters('productos',['getProducto']),
    }

  }
</script>