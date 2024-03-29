const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const ja = require('vuetify/es5/locale/ja')
const pkg = require('./package')

const server = {}
// HOSTとPORTは環境変数から変更できるようにしている
switch (process.env.NODE_ENV) {
  case 'development':
    server.host = 'localhost'
    server.port = 3000
    server.https = {
      key: fs.readFileSync(path.resolve(__dirname, 'ssl/develop.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'ssl/develop.crt')),
      httpPort: 8080
    }
    break
  case 'test':
    server.host = 'localhost'
    server.port = 3003
    break
  case 'production':
    // あとでファイル名を確認する
    const SSL_PATH = '/etc/letsencrypt/live/www.kanji-assembly.site/'
    server.https = {
      key: fs.readFileSync(path.resolve(SSL_PATH, 'privkey.pem')),
      cert: fs.readFileSync(path.resolve(SSL_PATH, 'cert.pem')),
      ca: [
        fs.readFileSync(path.resolve(SSL_PATH, 'chain.pem')),
        fs.readFileSync(path.resolve(SSL_PATH, 'fullchain.pem'))
      ]
    }
    break
}

const GoogleAdSenceInnerCode = `
(adsbygoogle = window.adsbygoogle || []).push({
  google_ad_client: 'ca-pub-3816961010765354',
  enable_page_level_ads: true
});`

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
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      {
        src: '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
        async: true,
        defer: true
      },
      { innerHTML: GoogleAdSenceInnerCode, type: 'text/javascript' }
    ],
    __dangerouslyDisableSanitizers: ['script']
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
    '@nuxtjs/vuetify'
    // '@nuxtjs/pwa'
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    https: true
  },

  router: {
    middleware: ['cookie'], // クッキーデータをVuexに移すためのミドルウェア
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
    sourceMap: true,
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
      if (ctx.isDev && ctx.isClient) {
        config.mode = 'development'
      }
    }
  },

  server: server,
  serverMiddleware: [
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    '~/server/Q/router.js',
    '~/server/user/router.js'
  ]
}
