'use strict'
const { TABLE_DEFINETION } = require('../tables/questions.js')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Questions', TABLE_DEFINETION)
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Questions')
  }
}
