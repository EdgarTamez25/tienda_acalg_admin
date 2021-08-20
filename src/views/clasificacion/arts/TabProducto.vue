<template>  
  <v-container>
  	<v-card>
		  <info/>
  	</v-card>
  </v-container>
</template>

<script>
  import {mapGetters} from 'vuex'
  import info from '@/views/clasificacion/arts/EditProducto.vue'
  export default {
  	components:{
  		info
  	},

    data () {
      return {
        activeTab: '/editproduct',
      }
    },

    cretaed(){
    	this.$router.push({name:'editproduct'}).catch(error=>{console.log(error)})
    }
  }

</script>