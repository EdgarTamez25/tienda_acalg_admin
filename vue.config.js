module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],

  publicPath: process.env.NODE_ENV === 'production'
	? '/admin-app/'
    : '/',

  pluginOptions: {
    cordovaPath: 'src-cordova'
  }
}


