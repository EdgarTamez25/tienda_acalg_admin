<template>
	<v-container>
		<v-row>
			<v-col cols="12">
				<v-card>
				  <v-card-title primary-title>
				    Configurar el tipo de cambio
				  </v-card-title>
				  <v-card-text>
				  	<v-col cols="12" xl="1" lg="2" md="3" sm="4" xs="6">
					    <v-text-field
					      v-model="tc"
					      label="Tipo de cambio"
					      type="number"
					    ></v-text-field>
				  	</v-col>
				  </v-card-text>
				  <v-card-actions>
				    <v-btn color="primary" @click="actualizar">Actualizar</v-btn> 
				  </v-card-actions>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>
<script>
	export default{
		data(){
			return{
				tc:'',
				id:'',
			}
		},

		// 18.789319.00

		created(){
			this.init()
		},

		methods:{
			actualizar(){
				var payload = {id: 1 ,tctienda: parseFloat(this.tc)}
				console.log('payload', payload)
				this.$http.put('api/v1/tctienda',payload).then(response=>{
					this.init()
				}).catch(error=>{
					console.log(error)
				})
			},

			init(){
				this.$http.get('api/v1/tctienda').then(response=>{
					console.log('tc', response.body.Tctienda)
					this.tc = response.body.Tctienda
					this.id = response.body.Id
				}).catch(error=>{
					console.log(error)
				})

				
			}
		}
	}
</script>