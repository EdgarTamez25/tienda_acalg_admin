<template>
	<v-container>
		<v-snackbar
      v-model="snackbar"
      :timeout="4000"
      top
      color="success"
    >
      Logotipo actualizado correctamente
      <v-btn
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
	  <v-row>
	  	<v-col cols="12">
	  		<v-card>
	  		  <v-card-title primary-title>
	  		    Actualiza tu logo
	  		  </v-card-title>
	  		  <v-divider></v-divider>
	  		  <v-card-text>
	  		    <v-row>
	  		    	<v-col cols="12" xl="6" lg="6" md="6" sm="6" xs="12">
	  		    		<v-card-title primary-title>
	  		    		  Logo
	  		    		</v-card-title>
	  		    		<v-card-text>
	  		    		  <v-file-input
                    outlined
							  		v-model="file"
								    accept="image/png, image/jpeg, image/bmp"
								    placeholder="Sube una imagen*"
								    prepend-icon="mdi-camera"
								    label="Sube una imagen*"
                    @change="cargar()"
								  ></v-file-input>
	  		    		</v-card-text>
	  		    		<v-card-text v-if="img">
	  		    			<v-card>
	  		    			  <v-card-title primary-title>
	  		    			    Nueva imagen
	  		    			  </v-card-title>
	  		    		  	<v-img :src="img" height="200" contain/>
	  		    		  	<v-card-actions>
	  		    		  	  <v-btn color="success" @click="actualizar" small>Actualizar</v-btn>
	  		    		  	</v-card-actions>
	  		    			</v-card>
	  		    		</v-card-text>

	  		    		<v-card-text v-if="ciaws.logourl">
	  		    			<v-card>
	  		    			  <v-card-title primary-title>
	  		    			    Imagen Actual
	  		    			  </v-card-title>
	  		    		  	<v-img :src="url + ciaws.logourl" height="200" contain/>
	  		    			</v-card>
	  		    		</v-card-text>
	  		    	</v-col>
	  		    </v-row>
	  		  </v-card-text>
	  		</v-card>
	  	</v-col>
	  </v-row>
	</v-container>
</template>

<script>
	export default{
		data(){
			return{
				url:'',
				logo:'',
				fileLogo:'',
				loading: false,
				file: [],

				ciaws: {},
				img:'',
				snackbar: false,

			}
		},
		
		created(){
			this.url = this.$http.options.root + 'fotos/'
			this.init()
		},

		methods:{
			init(){
				this.$http.get('config.list').then(response=>{
			  	this.ciaws = response.body
		  	}, error => {
		    	console.log(error)
		  	})
			},

			cargar(){
        console.log(this.file)
        if(this.file.length < 1){
          return
        }
        //mandamos a ocvertir la imagen a base64 pero mandamos el docuemnto, el formdata, el nombre
        this.getBase64(this.file)
      },

      getBase64(file) {
        var me = this
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          me.img =  reader.result 
        };
      },

      actualizar(){
       	this.ciaws.logourl = this.file.name
       	console.log(this.ciaws)
     //  	// creamos una variable tipo FormData
        let formData = new FormData();
        //se crea el objeto y se le agrega como un apendice el archivo 
        formData.append('file', this.file);
      	this.$http.post('imagenes', formData ).then(response=>{
          this.$http.put('config.update', this.ciaws).then(response=>{
          	this.snackbar = true
						this.init()	 
						this.img = '' 
					}).catch(error=>{
					  console.log(error)
					}).finally(()  => this.loading = false)
        })
      },
    }
	}
</script>