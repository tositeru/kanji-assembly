const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const ja = require('vuetify/es5/locale/ja')
const pkg = require('./package')

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: ['~/plugins/setup.js'],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc:https://github.com/nuxt-community/modules/tree/master/packages/bulma
    '@nuxtjs/bulma',
    '@nuxtjs/vuetify',
    '@nuxtjs/pwa'
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  router: {
    extendRoutes(routes, resolve) {
      routes.push({
        path: '*',
        redirect: '/'
      })
    }
  },

  vuetify: {
    locales: { ja },
    current: 'ja'
  },
  /*
  ** Build configuration
  */
  build: {
    postcss: {
      preset: {
        features: {
          customProperties: false
        }
      }
    },
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.mode = 'development'
        // config.module.rules.push({
        //   enforce: 'pre',
        //   test: /\.(js|vue)$/,
        //   loader: 'eslint-loader',
        //   exclude: /(node_modules)/,
        //   options: {
        //     fix: true,
        //   },
        // })
      }
    }
  },

  server: {
    host: 'localhost',
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'ssl/develop.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'ssl/develop.crt'))
    }
  },
  serverMiddleware: ['redirect-ssl', bodyParser.json(), '~/server/Q/router.js']
}
