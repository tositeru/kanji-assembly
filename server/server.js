const http = require('http')
const https = require('https')
const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()

module.exports = async function startServer(nuxtConfig) {
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
  if (nuxt.options.server.https) {
    const server = https.createServer(nuxt.options.server.https, app)
    server.listen(port, host)
    consola.ready({
      message: `Server listening on https://${host}:${port}`,
      badge: true
    })
    http
      .createServer(
        express().all('*', (req, res) => {
          if (port === 443) {
            res.redirect(`https://${req.hostname}${req.url}`)
          } else {
            res.redirect(`https://${req.hostname}:${port}${req.url}`)
          }
        })
      )
      .listen(nuxt.options.server.https.httpPort || 80)
    return server
  } else {
    app.listen(port, host)
    consola.ready({
      message: `Server listening on http://${host}:${port}`,
      badge: true
    })
    return app
  }
}
