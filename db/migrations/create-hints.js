'use strict'
const { TABLE_DEFINETION } = require('../tables/hints.js')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Hints', TABLE_DEFINETION)
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Hints')
  }
}
