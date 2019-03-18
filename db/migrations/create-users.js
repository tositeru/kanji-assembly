'use strict'
const { TABLE_DEFINETION } = require('../tables/users.js')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', TABLE_DEFINETION, {
      paranoid: true
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users')
  }
}
