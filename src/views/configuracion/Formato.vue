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
	      dark
		    @click.native="snakbar = false">Close</v-btn>
		</v-snackbar>
	  <v-row>
	  	<v-col cols="12" xl="6" lg="6" md="6" sm="6" xs="12">
	  		<v-alert class="elevation-6" color="blue" border="right" text type="info" :value="true">
	  			Aquí escribe las cuentas como quieres que aparezcan en el formato de cotización o pedidos
	  		</v-alert>
	  		<v-textarea outlined v-model="cuentas"  label="Cuentas" counter :rules="rules">
	  		</v-textarea>
	  		<v-textarea solo label="Cuentas" :value="ejemplo" readonly>
	  		</v-textarea>
	  		<v-btn color="success" @click="updateCuentas">actualizar</v-btn>
	  	</v-col>
	  	<v-col cols="12" xl="6" lg="6" md="6" sm="6" xs="12">
	  		<v-alert class="elevation-6" color="blue" border="right" text type="info" :value="true">
	  			Aquí escribe las condiciones comerciales para tu formato
	  		</v-alert>
	  		<v-textarea outlined v-model="condicom"  counter :rules="rulesCondi" label="Condiciones comerciales">
	  		</v-textarea>
	  	</v-col>
	  </v-row>
	</v-container>
</template>
<script>
	export default{
		data(){
			return{
				// reglas
				rules: [v => v.length <= 400 || 'Max 400 characters'],
				rulesCondi: [v => v.length <= 600 || 'Max 600 characters'],

				// variables principales
				ejemplo:`Banorte
Cuenta: XXXXXXXXXXXXXX
Clabe: XXXXXXXXXXXXXXX
				`,


				// Snackbar
				snakbar: false,
				color:'',
				text:'',
				ciaws:{},

				cuentas:' ',
				condicom:' ',
			}
		},

		created(){
			this.init()
		},

		methods:{
			init(){
				this.$http.get('config.list').then(response=>{
					this.ciaws = response.body
					this.cuentas = this.ciaws.cuentas
					this.condicom = this.ciaws.condicom
				})
			},

			updateCuentas(){
				this.ciaws.cuentas = this.cuentas
				this.ciaws.condicom = this.condicom
				this.$http.put('config.update', this.ciaws).then(response=>{
					this.text = 'Datos actualizados correctamente'
					this.color = 'success'
					this.snakbar = true
					this.init()
				}).catch(error=>{console.log(error)})

			},

		}
	}
</script>