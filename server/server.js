const https = require('https')
const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()

module.exports = async function startServer(nuxtConfig) {
  if (nuxtConfig.server.doRunTest) {
    nuxtConfig.serverMiddleware = nuxtConfig.serverMiddleware.filter(
      m => m !== 'redirect-ssl'
    )
  }
  // Init Nuxt.js
  const nuxt = new Nuxt(nuxtConfig)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  // Build only in dev mode
  if (nuxtConfig.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  const isTest = process.env.IS_TEST === 'true'
  if (isTest) {
    app.listen(3003, host)
    consola.ready({
      message: `For Running Test Version!! Server listening on http://${host}:3003`,
      badge: true
    })
    return app
  } else {
    const server = https.createServer(nuxt.options.server.https, app)
    server.listen(port, host)
    consola.ready({
      message: `Server listening on https://${host}:${port}`,
      badge: true
    })
    return server
  }
}
