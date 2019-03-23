'use strict'
const { TABLE_DEFINETION } = require('../tables/questions-type1.js')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('QuestionType1s', TABLE_DEFINETION)
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('QuestionType1s')
  }
}
