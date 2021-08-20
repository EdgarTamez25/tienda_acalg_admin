import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/views/Login/Home.vue'
import Login from '@/views/Login/Login.vue'

import VueJwtDecode from 'vue-jwt-decode'

import store from '@/store'
import rutas from '@/router'

Vue.use(VueRouter)

// const routes: 

const router = new VueRouter({
  mode: '',
  base: process.env.BASE_URL,
  routes: [

    //MODULO DE LOGIN
    { path: '/home', name: 'home' , component: Home, 
      meta: { ADMIN: true , USUARIO: true} },
    { path: '/'    , name: 'Login', component: Login , 
      meta: { libre: true }},

    // Productos
    { path: '/catproductos', name: 'catproductos', component: ()=> import('@/views/clasificacion/arts/CatProductos.vue'),
      meta: { ADMIN: true } },
    { path: '/tabproducto', name: 'tabproducto', component: ()=> import('@/views/clasificacion/arts/TabProducto.vue'),
      children: [
        { path: '/editproduct', name: 'editproduct', component: ()=> import('@/views/clasificacion/arts/EditProducto.vue'),
          meta: { ADMIN: true } },
        { path: '/imgproduct', name: 'imgproduct', component: ()=> import('@/views/clasificacion/arts/ImgProducto.vue'),
          meta: { ADMIN: true } },
        { path: '/preciosart', name: 'preciosart', component: ()=> import('@/views/clasificacion/arts/PreciosArt.vue'),
          meta: { ADMIN: true } },
      ],
      meta: { ADMIN: true } },

    { path: '/newproducto', name: 'newproducto', component: ()=> import('@/views/clasificacion/arts/NewProducto.vue'),
      meta: { ADMIN: true } },

      
    
    { path: '/myperfil', name: 'myperfil', component:()=> import('@/views/Login/MyPerfil.vue'), 
      meta: { ADMIN: true , USUARIO: true}} ,
      
    { path: '/registro', name: 'registro', component:()=> import('@/views/Login/Registro.vue') ,
      meta: { libre: true }} ,
    { path: '/olvidacontra', name: 'olvidacontra', component:()=> import('@/views/Login/OlvidaContra.vue') ,
      meta: { libre: true }} ,
      
    { path: '/cambiacontra/:id'  , name: 'cambiacontra'  , component:()=> import('@/views/Login/CambiaContra.vue') ,
      meta: { libre: true }},
    {path: '/activarusuario/:id', name: 'activarusuario', component:()=> import('@/views/Login/ActivarUsuario'),
      meta: { libre: true}},

    // Adeudos
    { path: '/catpagos', name: 'catpagos', component: ()=> import('@/views/adeudos/CatPagos.vue') ,
      meta: { ADMIN: true }},
    { path: '/newpagos', name: 'newpagos', component: ()=> import('@/views/adeudos/NewPagos.vue') ,
      meta: { ADMIN: true }},
    { path: '/editpagos', name: 'editpagos', component: ()=> import('@/views/adeudos/EditPagos.vue') ,
      meta: { ADMIN: true }},
    { path: '/catfacturas', name: 'catfacturas', component: ()=> import('@/views/adeudos/CatFacturas.vue') ,
      meta: { ADMIN: true }},
    { path: '/newfacturas', name: 'newfacturas', component: ()=> import('@/views/adeudos/NewFacturas.vue') ,
      meta: { ADMIN: true }},
    { path: '/editafacturas', name: 'editafacturas', component: ()=> import('@/views/adeudos/EditFacturas.vue') ,
      meta: { ADMIN: true }},
    { path: '/catpagoxfac', name: 'catpagoxfac', component: ()=> import('@/views/adeudos/CatPagoxfac.vue') ,
      meta: { ADMIN: true }},

   
    { path: '/catusuarios', name: 'catusuarios',  component: ()=> import('@/views/usuarios/CatUsuarios.vue') ,
      meta: { ADMIN: true } },
    { path: '/newusuario', name: 'newusuario',  component: ()=> import('@/views/usuarios/NewUsuario.vue') ,
      meta: { ADMIN: true } },


    { path: '/catentradas', name: 'catentradas', component: ()=> import('@/views/almacen/entradas/CatEntradas.vue'),
      meta: { ADMIN: true } },

    { path: '/catsalidas', name: 'catsalidas', component: ()=> import('@/views/almacen/salidas/CatSalidas.vue'),
      meta: { ADMIN: true } },

    { path: '/catexistencia', name: 'catexistencia',  component: ()=> import('@/views/almacen/existencias/CatExistencia.vue'),
      meta: { ADMIN: true } },
    { path: '/verexistencia', name: 'verexistencia',  component: ()=> import('@/views/almacen/existencias/VerExistencia.vue'),
      meta: { ADMIN: true } },

    { path: '/catdiscre', name: 'catdiscre',  component: ()=> import('@/views/almacen/discrepancias/CatDiscre.vue'),
      meta: { ADMIN: true } },

    { path: '/catlab',    name: 'catlab',     component: ()=> import('@/views/clasificacion/laboratorios/CatLab.vue'),
      meta: { ADMIN: true } },
    { path: '/subcatego', name: 'subcatego',  component: ()=> import('@/views/clasificacion/laboratorios/SubCategoria.vue'),
      meta: { ADMIN: true } },
    { path: '/familias' , name: 'familias',  component: ()=> import('@/views/clasificacion/laboratorios/Familias.vue'),
      meta: { ADMIN: true } },
    

    { path: '/tabmarketing', name: 'tabmarketing',  component: ()=> import('@/views/marketing/TabMarketing.vue'),
      meta: { ADMIN: true } },
    { path: '/banners', name: 'banners',  component: ()=> import('@/views/marketing/Banners.vue'),
      meta: { ADMIN: true } },
    { path: '/novedades', name: 'novedades',  component: ()=> import('@/views/marketing/Novedades.vue'),
      meta: { ADMIN: true } },
    { path: '/promos', name: 'promos',  component: ()=> import('@/views/marketing/Promos.vue'),
      meta: { ADMIN: true } },


    { path: '/configurar', name: 'configurar',  component: ()=> import('@/views/configuracion/Configurar.vue'),
      meta: { ADMIN: true } },


    { path: '/pedidos', name: 'pedidos',  component: ()=> import('@/views/administrativo/Pedidos.vue'),
      meta: { ADMIN: true } },
    { path: '/verpedido', name: 'verpedido',  component: ()=> import('@/views/administrativo/VerPedido.vue'),
      meta: { ADMIN: true } },

    { path: '/catclientes', name: 'catclientes',  component: ()=> import('@/views/clientes/CatClientes.vue'),
      meta: { ADMIN: true } },
    { path: '/impcliente', name: 'impcliente',  component: ()=> import('@/views/clientes/ImpCliente.vue'),
      meta: { ADMIN: true } },
    { path: '/newcliente', name: 'newcliente',  component: ()=> import('@/views/clientes/NewCliente.vue'),
      meta: { ADMIN: true } },
    { path: '/newclientebk', name: 'newclientebk',  component: ()=> import('@/views/clientes/newclientebk.vue'),
      meta: { ADMIN: true } },



  ]
})

router.beforeEach( (to, from, next) => {
  if(to.matched.some(record => record.meta.libre)){
    next()
  }else if(store.state.Login.datosUsuario.nivel == 'ADMIN'){
    if(to.matched.some(record => record.meta.ADMIN)){
      next()
    }
  }else if(store.state.Login.datosUsuario.nivel == 'USUARIO'){
    if(to.matched.some(record => record.meta.USUARIO)){
      next()
    }
  }else{
    next({
      name: 'Login'
    })
  }
})

export default router
