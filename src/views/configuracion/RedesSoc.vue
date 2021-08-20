<template>
	<v-container>
		<v-snackbar
		  v-model="snakbar"
		  :color="color"
		  top
		>
		  {{ text }}
		  <v-btn
		    text
	      dark @click.native="snakbar = false">Close</v-btn>
		</v-snackbar>
	  <v-row>
	  	<v-col cols="12" xl="5" lg="5" md="5" sm="6" xs="12">
	  		<a><img alt="Sígueme en facebook" height="47" width="47" src="https://2.bp.blogspot.com/-28mh2hZK3HE/XCrIxxSCW0I/AAAAAAAAH_M/XniFGT5c2lsaVNgf7UTbPufVmIkBPnWQQCLcBGAs/s1600/facebook.png" title="Sígueme en facebook"/></a>
	  		<v-text-field
	  		  label="facebook"
	  		  v-model="ciaws.facebook"
	  		></v-text-field>
	  	</v-col>

	  	<!-- <v-col cols="12" xl="5" lg="5" md="5" sm="6" xs="12">
	  		<a><img alt="Sígueme en facebook" height="47" width="47" src="https://1.bp.blogspot.com/-cAN1e-Ti9vM/XCrI4PCP8OI/AAAAAAAAIBE/AZmwfLUHlAsdyoQrMdCcOBV3hO2asAeyQCLcBGAs/s1600/youtube.png" title="Sígueme en facebook"/></a>
	  		<v-text-field
	  		  label="Youtube"
	  		  v-model="youtube"
	  		></v-text-field>
	  	</v-col>

	  	<v-col cols="12" xl="5" lg="5" md="5" sm="6" xs="12">
	  		<a><img alt="Sígueme en facebook" height="47" width="47" src="https://3.bp.blogspot.com/-E4jytrbmLbY/XCrI2Xd_hUI/AAAAAAAAIAo/qXt-bJg1UpMZmTjCJymxWEOGXWEQ2mv3ACLcBGAs/s1600/twitter.png" title="Sígueme en facebook"/></a>
	  		<v-text-field
	  		  label="twitter"
	  		  v-model="twitter"
	  		></v-text-field>
	  	</v-col>

	  	<v-col cols="12" xl="5" lg="5" md="5" sm="6" xs="12">
	  		<a><img alt="Sígueme en facebook" height="47" width="47" src="https://4.bp.blogspot.com/-0KtSvK3BydE/XCrIzgI3RqI/AAAAAAAAH_w/n_rr5DS92uk9EWEegcxeqAcSkV36OWEOgCLcBGAs/s1600/linkedin.png" title="Sígueme en facebook"/></a>
	  		<v-text-field
	  		  label="Linkedin"
	  		  v-model="linkedin"
	  		></v-text-field>
	  	</v-col> -->

	  	<v-col cols="12" xl="5" lg="5" md="5" sm="6" xs="12">
	  		<v-btn color="success" @click="updateRedes">Actualizar</v-btn>
	  	</v-col>
	  </v-row>
	</v-container>
</template>
<script>
	export default{
		data(){
			return{
				ciaws:{},
				// Snackbar
				snakbar: false,
				color:'',
				text:''

			}
		},

		created(){
			this.init()
		},

		methods:{

			init(){
				console.log("redessoc")
				this.$http.get('config.list').then(response=>{
					this.ciaws = response.body
				})
			},

			updateRedes(){
				this.$http.put('config.update', this.ciaws).then(response=>{
					this.text = 'Datos actualizados correctamente'
					this.color = 'success'
					this.snakbar = true
					this.init()
				}).catch(error=>{console.log(error)})
			}
		}
	}
</script>