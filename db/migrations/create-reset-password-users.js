'use strict'
const { TABLE_DEFINETION } = require('../tables/reset-password-users.js')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('ResetPasswordUsers', TABLE_DEFINETION)
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('ResetPasswordUsers')
  }
}
