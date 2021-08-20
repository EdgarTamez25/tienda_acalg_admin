<template>
  <v-card>
    <!-- <v-toolbar text color="primary" dark horizontal>
      <v-toolbar-title>Ajustes de cuenta</v-toolbar-title>
    </v-toolbar> -->
    <v-tabs dense>
      <v-tab>
        <v-icon left>mdi-account</v-icon>
        Cuenta
      </v-tab>
      <v-tab>
        <v-icon left>mdi-lock</v-icon>
        Datos fiscales
      </v-tab>
      <v-tab>
        <v-icon left>directions_car</v-icon>
        Direcciones de envío
      </v-tab>
      <v-tab>
        <v-icon left>shopping_basket</v-icon>
        Mis compras
      </v-tab>

      <v-tab-item>
        <v-card class="elevation-0">
          <Miperfil/>
        </v-card>
      </v-tab-item>

      <v-tab-item>
        <v-card class="elevation-0">
          <DatosFiscales/>
        </v-card>
      </v-tab-item>

      <v-tab-item>
        <v-card class="elevation-0">
          <Direcciones/>
        </v-card>
      </v-tab-item>

      <v-tab-item>
        <v-card class="elevation-0">
          <Miscompras/>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
	import Miperfil from '@/views/ajustes/MiPerfil.vue'
	import Direcciones from '@/views/ajustes/Direcciones'
  import DatosFiscales from '@/views/ajustes/DatosFiscales'
	import Miscompras from '@/views/ajustes/MisCompras'
	export default{
		components:{
			Miperfil,
			Direcciones,
			DatosFiscales,
      Miscompras

		},
	}
</script>