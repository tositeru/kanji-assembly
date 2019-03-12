'use strict'
const { TABLE_DEFINETION } = require('../tables/user-tmps.js')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('UserTmps', TABLE_DEFINETION)
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('UserTmps')
  }
}
