require('browser-env')()
const hooks = require('require-extension-hooks')
const Vue = require('vue')

Vue.config.productionTip = false

hooks('vue')
  .plugin('vue')
  .push()
hooks(['vue', 'js'])
  .plugin('babel')
  .push()

// fix a overrided Date class by jsdom
// https://github.com/vuejs/vue-test-utils/issues/936
window.Date = Date
