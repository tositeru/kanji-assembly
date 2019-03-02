const config = require('../nuxt.config.js')
const startServer = require('./server.js')

// Import and Set Nuxt.js options
config.dev = !(process.env.NODE_ENV === 'production')

startServer(config)
