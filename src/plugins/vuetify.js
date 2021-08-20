import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/es5/util/colors'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import es from 'vuetify/es5/locale/es';

Vue.use(Vuetify);

export default new Vuetify({
  lang:{
    locales:{ es },
    current: 'es'
  },
  
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    themes: {
      light: {
        primary: colors.blue.darken1, // #E53935
        secondary: colors.blue.darken3, // #FFCDD2
        accent: colors.indigo.base, // #3F51B5
        error:  colors.red.darken1,
        info:   colors.orange,
		    success: colors.green.darken2,
		    warning :  colors.teal
      },
    },
  },
});


// primary: colors.purple,
//         secondary: colors.grey.darken1,
//         accent: colors.shades.black,
//         error: colors.red.accent3,

// {
//   primary: '#1976D2',
//   secondary: '#424242',
//   accent: '#82B1FF',
//   error: '#FF5252',
//   info: '#2196F3',
//   success: '#4CAF50',
//   warning: '#FFC107',
// }