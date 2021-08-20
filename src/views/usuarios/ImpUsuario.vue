<template>
	<v-layout row wrap>
	  <v-flex xs12>
	  	<v-btn @click="imprimir"><v-icon>print</v-icon></v-btn>
	  </v-flex>
	</v-layout>
</template>
<script>
	import {mapActions, mapGetters} from 'vuex'
  //para la siguiente libreria se pide instalar
  //npm install jspdf jspdf-autotable
  //https://github.com/simonbengtsson/jsPDF-AutoTable

  
	export default{
		computed:{
			...mapGetters('vendedores',['cargarVendedores']),
		},
		methods: {
      imprimir(){
        var columns = [
          { title: 'ID'       , dataKey: 'IDvend' },
          { title: 'Nombre'   , dataKey: 'Nomvend' },
          { title: 'Tipo'     , dataKey: 'Clasif1' },
          { title: 'Direccion', dataKey: 'direccion' },
          { title: 'Colonia'  , dataKey: 'colonia' },
          { title: 'Ciudad'   , dataKey: 'Ciudad' },
          { title: 'Telefono' , dataKey: 'telefono' },
          { title: 'Email'    , dataKey: 'Email' }
        ];

        var rows = [];

        this.cargarVendedores.map(function(x){
          rows.push({
            IDvend      :x.IDvend,
            Nomvend     :x.Nomvend,
            Clasif1     :x.Clasif1,
            direccion   :x.direccion,
            colonia     :x.colonia,
            Ciudad      :x.Ciudad,
            telefono    :x.telefono,
            Email       :x.Email,
          });
        });

        // Only pt supported (not mm or in)
        var doc = new jsPDF('p', 'pt');
        doc.autoTable(columns, rows, {
          margin: {top: 60},
          
          addPageContent: function(data) {
              doc.text("Catátalogo de Vendedores", 40, 30);
          }
        });
        doc.save('Catátalogo_de_Vendedores.pdf');
      }
    }
	}
</script>