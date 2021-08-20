<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-tabs
          v-model="tab"
        >
          <v-tab
            v-for="item in items"
            :key="item.tab"
          >
            {{ item.tab }}
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item
            v-for="item in items"
            :key="item.tab"
          >
            <v-card flat>
              <v-card-text>
                <configcorreos v-if="tab == 0"/>
                <!-- <logotipo v-if="tab == 1"/> -->
                <!-- <formato v-if="tab == 1"/> -->
                <redessoc v-if="tab == 1"/>
                <tema v-if="tab == 2"/>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import configcorreos from '@/views/configuracion/ConfigCorreos.vue'
  // import logotipo      from '@/views/configuracion/Logotipo.vue'
  // import formato       from '@/views/configuracion/Formato.vue'
  import redessoc      from '@/views/configuracion/RedesSoc.vue'
  import tema          from '@/views/configuracion/TemaAdmin.vue'

  export default {
    components:{
      configcorreos,
      // logotipo,
      // formato,
      redessoc,
      tema,

    },

    data () {
      return {
        activeTab:'/configcorreos',
        e1: 0,

        tab: null,
        items: [
          { tab: 'Configurar Correos', content: 'configcorreos' },
          // { tab: 'Logotipo', content: 'logotipo' },
          // { tab: 'Formato', content: 'formato' },
          { tab: 'Redes Sociales', content: 'redessoc' },
          { tab: 'Tema', content: 'tema' },
        ],
      }
    },

    watch:{
      tab(){
        console.log(this.tab)
      }
    }

  }
</script>